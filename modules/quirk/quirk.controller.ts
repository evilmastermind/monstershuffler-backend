import { FastifyReply, FastifyRequest } from 'fastify';
import { getRandomQuirk } from './quirk.service';
import { handleError, handleResultFound } from '@/utils/errors';

export async function getRandomQuirkHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const quirk = await getRandomQuirk();
    return handleResultFound(quirk, reply);
  } catch (error) {
    return handleError(error, reply);
  }
}
