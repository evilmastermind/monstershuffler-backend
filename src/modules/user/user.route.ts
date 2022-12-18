import { FastifyInstance } from 'fastify';
import { loginHandler, registerUserHandler, getUsersHandler } from './user.controller';
import { jwtHeaderRequired } from '@/modules/schemas';
import { $ref } from './user.schema';

async function userRoutes(server: FastifyInstance) {
  server.post(
    '/', 
    {
      schema: {
        summary: 'Registers a new user in the database.',
        // TODO: users can only be created from monstershuffler.com
        description: 'Registers a new user in the database. Only accessible locally (users can only be created from monstershuffler.com).',
        tags: ['user'],
        body: $ref('createUserSchema'),
        response: {
          201: $ref('createUserResponseSchema')
        }
      }
    },
    registerUserHandler
  );

  server.post(
    '/login',
    {
      schema: {
        tags: ['user'],
        body: $ref('loginSchema'),
        response: {
          200: $ref('loginResponseSchema')
        },
      }
    },
    loginHandler
  );

  server.get(
    '/', {
      preHandler: [server.authenticate],
      schema: {
        tags: ['user'],
        headers: jwtHeaderRequired,
      }
    }
    ,getUsersHandler
  );
}


export default userRoutes;