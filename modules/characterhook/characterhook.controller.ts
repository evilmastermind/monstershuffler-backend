import { FastifyReply, FastifyRequest } from 'fastify';
import { getRandomCharacterhook,getRandomCharacterhookForAge } from './characterhook.service';
import { handleError, handleResultFound } from '@/utils/errors';

export async function getRandomCharacterhookHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const characterhook = await getRandomCharacterhook();
    return handleResultFound(characterhook, reply);
  } catch (error) {
    return handleError(error, reply);
  }
}

export async function getRandomCharacterhookForAgeHandler(
  request: FastifyRequest<{
    Params: {
      age: string;
    };
  }>,
  reply: FastifyReply
) {
  const age = request.params.age;
  try {
    const characterhook = await getRandomCharacterhookForAge(age);
    return handleResultFound(characterhook, reply);
  } catch (error) {
    return handleError(error, reply);
  }
}
