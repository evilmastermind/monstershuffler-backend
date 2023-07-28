import { FastifyReply, FastifyRequest } from 'fastify';
import { getRandomQuirk } from './quirk.service';
import { handleError } from '@/utils/errors';

export async function getRandomQuirkHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const quirk = await getRandomQuirk();
    return reply.code(200).send(quirk);
  } catch (error) {
    return handleError(error, reply);
  }
}
