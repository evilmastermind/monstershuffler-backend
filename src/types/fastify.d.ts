import { FastifyInstance } from 'fastify';
import '@fastify/jwt';

declare module 'fastify' {
  export interface FastifyInstance {
    authenticate: any;
    authenticateOptional: any;
  }
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: { id: number } // payload type is used for signing and verifying
    user: {
      id: number,
      } // user type is return type of `request.user` object
  }
}

