import { getRandomNameInput } from './name.schema';
import { FastifyReply, FastifyRequest } from 'fastify';
import { getRandomName } from './name.service';
import { handleError, handleResultFound } from '@/utils/errors';

export async function getRandomNameHandler(
  request: FastifyRequest<{ Body: getRandomNameInput }>,
  reply: FastifyReply
) {
  try {
    const { body } = request;
    const name = await getRandomName(body);
    return handleResultFound(name, reply);
  } catch (error) {
    return handleError(error, reply);
  }
}
