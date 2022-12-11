import { server } from '@/app';
import { comparePassword } from '@/utils/hash';
import { CreateUserInput, LoginInput } from './user.schema';
import { FastifyReply, FastifyRequest } from 'fastify';
import { createUser, findUserByEmail, getUsers, getUserLevel } from './user.service';
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
// since the new verification/hashing process is different
export async function loginHandler (
  request: FastifyRequest<{ Body: LoginInput; }>, 
  reply: FastifyReply
) {
  const body = request.body; 

  // find user by email
  const user = await findUserByEmail(body.email);
  if (!user) {
    return reply.code(401).send({
      message: 'Invalid email or password'
    });
  }
  // verify password
  const isPasswordCorrect = comparePassword(body.password, user.password);
  if (!isPasswordCorrect) {
    return reply.code(401).send({
      message: 'Invalid email or password'
    });
  }
  // generate accesstoken
  const { id } = user;
  return { accessToken: server.jwt.sign({ id }) };
}


export async function getUsersHandler(request: FastifyRequest, reply: FastifyReply) {
  console.log(request.user);
  
  if(!await isUserAdmin(request.user.id)) {
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