import { GetRandomSurnameBody } from './surname.schema';
import { FastifyReply, FastifyRequest } from 'fastify';
import { sGetRandomSurname } from './surname.service';
import { handleError, handleResultFound } from '@/utils/errors';

export async function sGetRandomSurnameHandler(
  request: FastifyRequest<{ Body: GetRandomSurnameBody }>,
  reply: FastifyReply
) {
  try {
    const { body } = request;
    const surname = await sGetRandomSurname(body);
    return handleResultFound(surname, reply);
  } catch (error) {
    return handleError(error, reply);
  }
}
