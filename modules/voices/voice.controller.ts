import { GetRandomVoiceInput } from './voice.schema';
import { FastifyReply, FastifyRequest } from 'fastify';
import { sGetRandomVoice } from './voice.service';
import { handleError } from '@/utils/errors';

export async function sGetRandomVoiceHandler(
  request: FastifyRequest<{ Body: GetRandomVoiceInput }>,
  reply: FastifyReply
) {
  try {
    const { body } = request;
    const voice = await sGetRandomVoice(body);
    return reply.code(200).send({ voice });
  } catch (error) {
    return handleError(error, reply);
  }
}
