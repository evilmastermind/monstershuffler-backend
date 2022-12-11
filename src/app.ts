import 'module-alias/register';
import Fastify, { FastifyRequest, FastifyReply } from 'fastify';
import swagger from '@fastify/swagger';
import { withRefResolver } from 'fastify-zod';
import Sensible from '@fastify/sensible';
import fjwt from '@fastify/jwt';
import userRoutes from './modules/user/user.route';
import { userSchemas } from '@/modules/user/user.schema';
import { version } from '../package.json';

export const server = Fastify();

const secret = process.env.JWT_SECRET;
if( secret === undefined) {
  console.error('Missing JWT_SECRET in .env');
  process.exit(1);
}

server
  // jwt
  .register(fjwt, {
    secret: secret
  })
  // default responses & other tools
  .register(Sensible)
  // authentication with jwt
  .decorate(
    'authenticate', 
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        await request.jwtVerify();
      } catch (error) { 
        return reply.send(error);
      }
    }
  )
  // test route
  .get('/health', async function () {
    return { status: 'ok' };
  });

async function main() {
  try {

    for(const schema of userSchemas) {
      server.addSchema(schema);
    }

    server.register(
      swagger,
      withRefResolver({
        routePrefix: '/docs',
        exposeRoute: true,
        staticCSP: true,
        openapi: {
          info: {
            title: 'Monstershuffler API',
            description: 'REST API for monstershuffler.com',
            version,
          }
        }

      })
    );

    server.register(userRoutes, { prefix: 'api/users' });

    await server.listen({ port: 3000, host: '0.0.0.0' });

    console.log('server ready at http://localhost:3000');
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}




main();