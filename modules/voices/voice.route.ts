import { FastifyInstance } from 'fastify';
import { sGetRandomVoiceHandler } from './voice.controller';
import { sGetRandomVoiceResponse, sGetRandomVoiceBody } from 'monstershuffler-shared';

export async function voiceRoutes(server: FastifyInstance) {
  server.get(
    '/random',
    {
      schema: {
        summary: 'Returns a random type of voice.',
        description:
          'Returns the name of a real person or a character from a movie, tv show, and the file name of its voice sample.',
        body: sGetRandomVoiceBody,
        tags: ['voices'],
        response: {
          200: sGetRandomVoiceResponse,
        },
      },
    },
    sGetRandomVoiceHandler
  );
}
