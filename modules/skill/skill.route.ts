import { FastifyInstance } from 'fastify';
import { getSkillListHandler, getRandomSkillHandler } from './skill.controller';
import { sGetSkillListResponse, sGetSkillResponse } from 'monstershuffler-shared';
import { jwtHeaderOptional } from '@/schemas';
import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';

const skillRoutes: FastifyPluginAsyncZod = async function (server: FastifyInstance) {
  server.get(
    '/',
    {
      preHandler: [server.authenticateOptional],
      schema: {
        summary: 'Get a list of all skills in the game.',
        description: 'Get a list of all skills in the game.',
        headers: jwtHeaderOptional,
        tags: ['skills'],
        response: {
          200: sGetSkillListResponse,
        },
      },
    },
    getSkillListHandler
  );

  server.get(
    '/random',
    {
      preHandler: [server.authenticateOptional],
      schema: {
        summary: 'Get a random skill from the game.',
        description: 'Get a random skill from the game.',
        headers: jwtHeaderOptional,
        tags: ['skills'],
        response: {
          200: sGetSkillResponse,
        },
      },
    },
    getRandomSkillHandler
  );
};

export default skillRoutes;
