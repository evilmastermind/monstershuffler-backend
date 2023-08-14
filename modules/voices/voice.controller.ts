import { getRandomVoiceInput } from './voice.schema';
import { FastifyReply, FastifyRequest } from 'fastify';
import { getRandomVoice } from './voice.service';
import { handleError } from '@/utils/errors';

export async function getRandomVoiceHandler(
  request: FastifyRequest<{ Body: getRandomVoiceInput }>,
  reply: FastifyReply
) {
  try {
    const { body } = request;
    const voice = await getRandomVoice(body);
    return reply.code(200).send({ voice });
  } catch (error) {
    return handleError(error, reply);
  }
}
