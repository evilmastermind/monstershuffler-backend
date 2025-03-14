import { server } from '@/app';
import { comparePassword } from '@/utils/hash';
import {
  PostUserBody,
  LoginBody,
  PutUserBody,
  ActivateUserBody,
  ReactivateUserBodyInput,
  ResetPasswordBody,
} from './user.schema';
import { FastifyReply, FastifyRequest } from 'fastify';
import {
  createUser,
  getUserByToken,
  sActivateUserBody,
  findUserByEmail,
  getUsers,
  getUser,
  updateUser,
  getUserLevel,
  createTokenPwd,
  sResetPasswordBody,
} from './user.service';
import { handleError } from '@/utils/errors';

export async function registerUserHandler(
  request: FastifyRequest<{ Body: PostUserBody }>,
  reply: FastifyReply
) {
  const body = request.body;
  try {
    const doesEmailExist = await findUserByEmail(body.email);
    if (doesEmailExist) {
      return reply.code(409).send({
        message: 'Email already exists',
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
      subject: 'Monstershuffler.com - confirm your email address',
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

export async function loginHandler(
  request: FastifyRequest<{ Body: LoginBody }>,
  reply: FastifyReply
) {
  try {
    const body = request.body;
    const user = await findUserByEmail(body.email);
    const genericErrorMessage = {
      message: 'Invalid email or password',
    };
    if (!user) {
      return reply.code(401).send(genericErrorMessage);
    }
    if (!user.verified) {
      return reply.code(403).send({
        message: 'Please verify your email address',
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
    console.log(error);
    return handleError(error, reply);
  }
}

export async function activationHandler(
  request: FastifyRequest<{ Body: ActivateUserBody }>,
  reply: FastifyReply
) {
  try {
    const { token } = request.body;
    const user = await getUserByToken(token);
    if (!user.length) {
      return reply.code(404).send({
        message: 'Invalid token',
      });
    }
    await sActivateUserBody(user[0].id);
    return { accessToken: server.jwt.sign({ id: user[0].id }) };
  } catch (error) {
    return handleError(error, reply);
  }
}

export async function pwdResetHandler(
  request: FastifyRequest<{ Body: ResetPasswordBody }>,
  reply: FastifyReply
) {
  try {
    const { token, password } = request.body;
    const user = await sResetPasswordBody(token, password);
    return { accessToken: server.jwt.sign({ id: user.id }) };
  } catch (error) {
    return handleError(error, reply);
  }
}

export async function reactivationHandler(
  request: FastifyRequest<{ Body: ReactivateUserBodyInput }>,
  reply: FastifyReply
) {
  try {
    const { email } = request.body;
    let user = await findUserByEmail(email);
    if (!user) {
      return reply.code(404).send({
        message: 'Invalid email',
      });
    }
    user = await createTokenPwd(user.id);

    const link = `https://monstershuffler.com/reset-password?token=${user.tokenpwd}`;
    const { mailer } = server;

    mailer.sendMail({
      to: user.email,
      subject: 'Monstershuffler.com - password reset',
      html: `
    <!DOCTYPE html>
    <html lang="en">
      <head><title>Monstershuffler.com - password reset</title></head>
      <body>
        <p><b>Monstershuffler.com</b></p>
        <p>This is the link to reset your password:</p>
        <p><a href="${link}">${link}</a></p>
        <p>If you did not request a password reset please ignore this message.</p>
      </body>
    </html>
    `,
    });
    return reply.code(200).send('Email sent!');
  } catch (error) {
    return handleError(error, reply);
  }
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
  request: FastifyRequest<{ Body: PutUserBody }>,
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
