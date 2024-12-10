import { GetRandomName } from './name.schema';
import { FastifyReply, FastifyRequest } from 'fastify';
import { sGetRandomName } from './name.service';
import { handleError, handleResultFound } from '@/utils/errors';

export async function sGetRandomNameHandler(
  request: FastifyRequest<{ Body: GetRandomName }>,
  reply: FastifyReply
) {
  try {
    const { body } = request;
    const name = await sGetRandomName(body);
    return handleResultFound(name, reply);
  } catch (error) {
    return handleError(error, reply);
  }
}
