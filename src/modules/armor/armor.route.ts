import { FastifyInstance } from 'fastify';
import { createArmorHandler, getArmorHandler, getArmorListHandler } from './armor.controller';
import { $ref } from './armor.schema';

async function armorRoutes(server: FastifyInstance) {
  server.post(
    '/',
    {
      preHandler: [server.authenticate],
      schema: {
        body: $ref('createArmorSchema'),
      },
    },
    createArmorHandler
  );

  server.get(
    '/:armorId',
    {
      preHandler: [server.authenticateOptional],
    },
    getArmorHandler
  );

  server.get(
    '/list',
    {
      preHandler: [server.authenticateOptional],
    },
    getArmorListHandler
  );
}

export default armorRoutes;