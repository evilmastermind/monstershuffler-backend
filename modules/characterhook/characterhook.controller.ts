import { FastifyReply, FastifyRequest } from 'fastify';
import { getRandomCharacterhook } from './characterhook.service';
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
