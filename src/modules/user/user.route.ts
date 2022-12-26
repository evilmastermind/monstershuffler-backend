import { FastifyInstance } from 'fastify';
import { loginHandler, registerUserHandler, getUserHandler, updateUserHandler } from './user.controller';
import { jwtHeaderRequired } from '@/modules/schemas';
import { $ref } from './user.schema';

async function userRoutes(server: FastifyInstance) {

  server.post(
    '/login',
    {
      schema: {
        summary: 'Logs in a user and returns an access token.',
        description: 'Logs in a user and returns an access token. Logged users can then receive their creations through other routes, and access other protected routes.',
        tags: ['users'],
        body: $ref('loginSchema'),
        response: {
          200: $ref('loginResponseSchema')
        },
      }
    },
    loginHandler
  );

  server.post(
    '/', 
    {
      schema: {
        // hide: true,
        summary: '[MS ONLY] Registers a new user in the database.',
        // TODO: users can only be created from monstershuffler.com
        description: 'Registers a new user in the database. Only accessible through monstershuffler.com',
        tags: ['users'],
        body: $ref('createUserSchema'),
        response: {
          201: $ref('createUserResponseSchema')
        }
      }
    },
    registerUserHandler
  );

  server.post(
    '/me',
    {
      preHandler: [server.authenticate],
      schema: {
        summary: '[MS ONLY] Returns the details of the user corresponding to the given token.',
        description: 'Returns the details of the user corresponding to the given token. Only accessible through monstershuffler.com',
        tags: ['users'],
        headers: jwtHeaderRequired,
        response: {
          200: $ref('getUserResponseSchema')
        },
      },  
    },
    getUserHandler
  );

  server.put(
    '/',
    {
      preHandler: [server.authenticate],
      schema: {
        summary: '[MS ONLY] Updates the user info corresponding to the given token.',
        description: 'Updates the user info corresponding to the given token. Only accessible through monstershuffler.com.',
        tags: ['users'],
        headers: jwtHeaderRequired,
        body: $ref('updateUserSchema'),
        response: {
          200: $ref('getUserResponseSchema')
        },
      }
    },
    updateUserHandler,
  );

  // server.get(
  //   '/', {
  //     preHandler: [server.authenticate],
  //     schema: {
  //       tags: ['user'],
  //       headers: jwtHeaderRequired,
  //     }
  //   }
  //   ,getUsersHandler
  // );
}


export default userRoutes;