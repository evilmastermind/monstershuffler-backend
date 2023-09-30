import { getRandomSurnameInput } from './surname.schema';
import { FastifyReply, FastifyRequest } from 'fastify';
import { getRandomSurname } from './surname.service';
import { handleError, handleResultFound } from '@/utils/errors';

export async function getRandomSurnameHandler(
  request: FastifyRequest<{ Body: getRandomSurnameInput }>,
  reply: FastifyReply
) {
  try {
    const { body } = request;
    const surname = await getRandomSurname(body);
    return handleResultFound(surname, reply);
  } catch (error) {
    return handleError(error, reply);
  }
}
