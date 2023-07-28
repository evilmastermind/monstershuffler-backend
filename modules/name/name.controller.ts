import { getRandomNameInput } from './name.schema';
import { FastifyReply, FastifyRequest } from 'fastify';
import { getRandomName } from './name.service';
import { handleError } from '@/utils/errors';

export async function getRandomNameHandler(
  request: FastifyRequest<{ Body: getRandomNameInput }>,
  reply: FastifyReply
) {
  try {
    const { body } = request;
    const name = await getRandomName(body);
    return reply.code(200).send({ name });
  } catch (error) {
    return handleError(error, reply);
  }
}
