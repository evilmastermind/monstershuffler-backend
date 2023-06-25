import { server } from "@/app";
import { comparePassword } from "@/utils/hash";
import {
  CreateUserInput,
  LoginInput,
  UpdateUserInput,
  ActivateUserInput,
} from "./user.schema";
import { FastifyReply, FastifyRequest } from "fastify";
import {
  createUser,
  getUserByToken,
  activateUser,
  findUserByEmail,
  getUsers,
  getUser,
  updateUser,
  getUserLevel,
} from "./user.service";
import { handleError } from "@/utils/errors";

export async function registerUserHandler(
  request: FastifyRequest<{ Body: CreateUserInput }>,
  reply: FastifyReply
) {
  const body = request.body;
  try {
    const doesEmailExist = await findUserByEmail(body.email);
    if (doesEmailExist) {
      return reply.code(409).send({
        message: "Email already exists",
      });
    }
  } catch (error) {
    return handleError(error, reply);
  }
  try {
    const user = await createUser(body);
    const link = `https://monstershuffler.com/verify-email?token=${user.token}`;
    const { mailer } = server;

    mailer.sendMail({
      to: user.email,
      subject: "Monstershuffler.com - confirm your email address",
      html: `
    <!DOCTYPE html>
    <html lang="en">
      <head><title>Monstershuffler.com - confirm your email address</title></head>
      <body>
        <p><b>Monstershuffler.com</b></p>
        <p>Thank you ${user.username} for joining us! Please confirm your email by clicking on this link:</p>
        <p><a href="${link}">${link}</a></p>
      </body>
    </html>
    `,
    });

    return reply.code(201).send(user);

    //   (errors, info) => {
    //     if (errors) {
    //       console.log("MAIL ERROR: ", errors);
    //       server.log.error(errors);
    //       reply.status(500);
    //       return {
    //         status: "error",
    //         message: "Something went wrong",
    //       };
    //     }
    //   }
    // );
  } catch (error) {
    return handleError(error, reply);
  }
}

// TODO: moving from ms1 to ms2 will require to reset the users' passwords
// since the new validation/hashing process is different
export async function loginHandler(
  request: FastifyRequest<{ Body: LoginInput }>,
  reply: FastifyReply
) {
  try {
    const body = request.body;
    const user = await findUserByEmail(body.email);
    const genericErrorMessage = {
      message: "Invalid email or password",
    };
    if (!user) {
      return reply.code(401).send(genericErrorMessage);
    }
    if (!user.verified) {
      return reply.code(403).send({
        message: "Please verify your email address",
      });
    }
    const isPasswordCorrect = await comparePassword(
      body.password,
      user.password
    );
    if (isPasswordCorrect) {
      const { id } = user;
      return { accessToken: server.jwt.sign({ id }) };
    }
    return reply.code(401).send(genericErrorMessage);
  } catch (error) {
    return handleError(error, reply);
  }
}

export async function activationHandler(
  request: FastifyRequest<{ Body: ActivateUserInput }>,
  reply: FastifyReply
) {
  const { token } = request.body;
  const user = await getUserByToken(token);
  if (!user.length) {
    return reply.code(404).send({
      message: "Invalid token",
    });
  }
  await activateUser(user[0].id);
  return { accessToken: server.jwt.sign({ id: user[0].id }) };
}

export async function getUsersHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const isUserAllowed = await isUserAdmin(request.user.id);
  if (!isUserAllowed) {
    return reply.unauthorized();
  }
  return await getUsers();
}

export async function isUserAdmin(id: number) {
  const { level } = (await getUserLevel(id)) || {};
  if (!level || level < 5) {
    return false;
  }
  return true;
}

export async function getUserHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = request.user;
  try {
    const user = await getUser(id);
    return reply.code(200).send(user);
  } catch (error) {
    return handleError(error, reply);
  }
}

export async function updateUserHandler(
  request: FastifyRequest<{ Body: UpdateUserInput }>,
  reply: FastifyReply
) {
  const { id } = request.user;
  const { body } = request;
  try {
    const user = await updateUser(id, body);
    return reply.code(200).send(user);
  } catch (error) {
    return handleError(error, reply);
  }
}
