import { FastifyReply, FastifyRequest } from 'fastify';
import { PostRandomCharacterhookBody } from './characterhook.schema';
import { getRandomCharacterhook } from './characterhook.service';
import { handleError, handleResultFound } from '@/utils/errors';

export async function postRandomCharacterhookHandler(
  request: FastifyRequest<{
    Body: PostRandomCharacterhookBody
  }>,
  reply: FastifyReply
) {
  try {
    const characterhook = await getRandomCharacterhook(request.body);
    return handleResultFound(characterhook, reply);
  } catch (error) {
    return handleError(error, reply);
  }
}
