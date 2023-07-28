import { FastifyInstance } from 'fastify';
import '@fastify/jwt';
import { Transporter } from 'nodemailer';

export interface FastifyMailerNamedInstance {
  [namespace: string]: Transporter;
}
export type FastifyMailer = FastifyMailerNamedInstance & Transporter;

declare module 'fastify' {
  export interface FastifyInstance {
    authenticate: any;
    authenticateOptional: any;
    MSOnly: any;
    mailer: FastifyMailer;
  }
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: { id: number }; // payload type is used for signing and verifying
    user: {
      id: number;
    }; // user type is return type of `request.user` object
  }
}
