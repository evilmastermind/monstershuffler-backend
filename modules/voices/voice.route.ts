import { FastifyInstance } from 'fastify';
import { getRandomVoiceHandler } from './voice.controller';
import { $ref } from './voice.schema';

async function voiceRoutes(server: FastifyInstance) {
  server.get(
    '/random',
    {
      schema: {
        summary: 'Returns a random type of voice.',
        description:
          'Returns the name of a real person or a character from a movie, tv show, and the file name of its voice sample.',
        body: $ref('getRandomVoice'),
        tags: ['voices'],
        response: {
          200: $ref('getRandomVoiceResponse'),
        },
      },
    },
    getRandomVoiceHandler
  );
}
