import { FastifyInstance } from 'fastify';
import {
  loginHandler,
  activationHandler,
  registerUserHandler,
  getUserHandler,
  updateUserHandler,
  reactivationHandler,
  pwdResetHandler,
} from './user.controller';
import { jwtHeaderRequired } from '@/schemas';
import { $ref } from './user.schema';

async function userRoutes(server: FastifyInstance) {
  server.post(
    '/login',
    {
      schema: {
        summary: 'Logs in a user and returns an access token.',
        description:
          'Logs in a user and returns an access token. Logged users can then receive their creations through other routes, and access other protected routes.',
        tags: ['users'],
        body: $ref('loginSchema'),
        response: {
          200: $ref('loginResponse'),
        },
      },
    },
    loginHandler
  );

  server.post(
    '/',
    {
      preHandler: [server.MSOnly],
      schema: {
        hide: true,
        summary: '[MS ONLY] Registers a new user in the database.',
        // TODO: users can only be created from monstershuffler.com
        description:
          'Registers a new user in the database. Only accessible through monstershuffler.com',
        tags: ['users'],
        body: $ref('postUser'),
        response: {
          201: $ref('postUserResponse'),
        },
      },
    },
    registerUserHandler
  );

  server.put(
    '/verify',
    {
      preHandler: [server.MSOnly],
      schema: {
        hide: true,
        summary:
          '[MS ONLY] Verifies the user\'s email and activates the account.',
        description:
          'Activates an account by providing the validation token sent via email. Only accessible through monstershuffler.com',
        tags: ['users'],
        body: $ref('activateUser'),
        response: {
          200: $ref('loginResponse'),
        },
      },
    },
    activationHandler
  );

  server.post(
    '/reactivation',
    {
      preHandler: [server.MSOnly],
      schema: {
        hide: true,
        summary: '[MS ONLY] Resends the activation email to the user.',
        description:
          'Resends the activation email to the user. The user will have to reset their password as well. Only accessible through monstershuffler.com',
        tags: ['users'],
        body: $ref('reactivateUser'),
        response: {
          200: { type: 'string' },
          404: { type: 'string' },
        },
      },
    },
    reactivationHandler
  );

  server.put(
    '/pwdreset',
    {
      preHandler: [server.MSOnly],
      schema: {
        hide: true,
        summary: '[MS ONLY] Resets the user\'s password.',
        description:
          'Resets the user\'s password. Only accessible through monstershuffler.com',
        tags: ['users'],
        body: $ref('resetPassword'),
        response: {
          200: $ref('loginResponse'),
          404: { type: 'string' },
        },
      },
    },
    pwdResetHandler
  );

  server.get(
    '/me',
    {
      preHandler: [server.authenticate, server.MSOnly],
      schema: {
        hide: true,
        summary:
          '[MS ONLY] Returns the details of the user corresponding to the given token.',
        description:
          'Returns the details of the user corresponding to the given token. Only accessible through monstershuffler.com',
        tags: ['users'],
        headers: jwtHeaderRequired,
        response: {
          200: $ref('getUserResponse'),
        },
      },
    },
    getUserHandler
  );

  // server.put(
  //   '/',
  //   {
  //     preHandler: [server.authenticate],
  //     schema: {
  //       summary: '[MS ONLY] Updates the user info corresponding to the given token.',
  //       description: 'Updates the user info corresponding to the given token. Only accessible through monstershuffler.com.',
  //       tags: ['users'],
  //       headers: jwtHeaderRequired,
  //       body: $ref('putUser'),
  //       response: {
  //         200: $ref('getUserResponse')
  //       },
  //     }
  //   },
  //   updateUserHandler,
  // );

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
