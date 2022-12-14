import { server } from '@/app';
import { comparePassword } from '@/utils/hash';
import { CreateUserInput, LoginInput, UpdateUserInput } from './user.schema';
import { FastifyReply, FastifyRequest } from 'fastify';
import { createUser, findUserByEmail, getUsers, getUser, updateUser, getUserLevel } from './user.service';
import { handleError } from '@/utils/errors';


export async function registerUserHandler (
  request: FastifyRequest<{ Body: CreateUserInput }>, 
  reply: FastifyReply
) {
  const body = request.body;

  try {
    const user = await createUser(body);
    return reply.code(201).send(user);

  } catch(error) {
    return handleError(error, reply);
  }
}


// TODO: moving from ms1 to ms2 will require to reset the users' passwords 
// since the new validation/hashing process is different
export async function loginHandler (
  request: FastifyRequest<{ Body: LoginInput; }>, 
  reply: FastifyReply
) {
  const body = request.body; 
  const user = await findUserByEmail(body.email);
  const genericErrorMessage = { 
    message: 'Invalid email or password' 
  };
  if (!user) {
    return reply.code(401).send(genericErrorMessage);
  }
  const isPasswordCorrect = await comparePassword(body.password, user.password);
  if (isPasswordCorrect) {
    const { id } = user;
    return { accessToken: server.jwt.sign({ id }) };
  }
  return reply.code(401).send(genericErrorMessage);
}


export async function getUsersHandler(request: FastifyRequest, reply: FastifyReply) {
  const isUserAllowed = await isUserAdmin(request.user.id);
  if(!isUserAllowed) {
    return reply.unauthorized();
  }
  return await getUsers();
}


export async function isUserAdmin(id: number) {
  const { level } = await getUserLevel(id) || {};
  if (!level || level < 5) {
    return false;
  }
  return true;
}

export async function getUserHandler(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.user;
  try {
    const user = await getUser(id);
    return reply.code(200).send(user);
  }
  catch (error) {
    return handleError(error, reply);
  }
}

export async function updateUserHandler(
  request: FastifyRequest<{Body: UpdateUserInput}>,
  reply: FastifyReply) {
  const { id } = request.user;
  const { body } = request;
  try {
    const user = await updateUser(id, body);
    return reply.code(200).send(user);
  }
  catch (error) {
    return handleError(error, reply);
  }
}