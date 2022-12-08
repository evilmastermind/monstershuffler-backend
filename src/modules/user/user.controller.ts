import { server } from '@/app';
import { comparePassword } from '@/utils/hash';
import { CreateUserInput, LoginInput } from './user.schema';
import { FastifyReply, FastifyRequest } from 'fastify';
import { createUser, findUserByEmail } from './user.service';
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
  const { password, ...rest} = user;
  return { accessToken: server.jwt.sign(rest) };
}