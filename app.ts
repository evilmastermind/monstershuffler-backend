import 'module-alias/register';
import * as dotenv from 'dotenv';
import Fastify, { FastifyRequest, FastifyReply, FastifyError } from 'fastify';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { withRefResolver } from 'fastify-zod';
import Sensible from '@fastify/sensible';
import fjwt from '@fastify/jwt';
import cors from '@fastify/cors';
import swaggerSettings from '@/plugins/swagger';
import mailerSettings from '@/plugins/mailer';
import { schemas, routes } from '@/modules';
import fs from 'fs';

dotenv.config();
export const server = Fastify({ logger: true });
// export const server = Fastify();

const secret = process.env.JWT_SECRET;
if (secret === undefined) {
  console.error('Missing JWT_SECRET in .env');
  process.exit(1);
}

server
  // cors
  .register(cors, {
    origin: true,
  })
  // jwt
  .register(fjwt, {
    secret: secret,
  })
  // default responses & other tools
  .register(Sensible)
  // mailer
  .register(require('fastify-mailer'), mailerSettings)
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
  .decorate('authenticateOptional', async (request: FastifyRequest) => {
    try {
      await request.jwtVerify();
    } catch (error) {
      return; // keep going without authentication
    }
  })
  .decorate(
    'MSOnly',
    function (
      request: FastifyRequest,
      reply: FastifyReply,
      done: (err?: FastifyError) => void
    ) {
      const whitelist = ['127.0.0.1'];
      const ip = request.ip;

      if (!whitelist.includes(ip)) {
        reply.status(403).send({ error: 'Not allowed' });
      } else {
        done();
      }
    }
  )
  // test route
  .get('/api/health', async function () {
    return { status: "'TIS WORKIN', CHIEF!" };
  })

  .setErrorHandler(function (error, request, reply) {
    if (error instanceof Fastify.errorCodes.FST_ERR_BAD_STATUS_CODE) {
      this.log.error(error);
      reply.status(500).send({ ok: false });
    } else {
      reply.send(error);
    }
  });

async function main() {
  try {
    for (const schema of schemas) {
      server.addSchema(schema);
    }

    server.register(swagger, withRefResolver(swaggerSettings));

    server.register(swaggerUi, {
      routePrefix: 'api/docs',
      staticCSP: true,
    });

    for (const route of routes) {
      server.register(route.routes, { prefix: route.prefix });
    }

    await server.listen({ port: 3000, host: '0.0.0.0' });
    console.info('///////////////////////////////////////////');
    console.info('// M O N S T E R S H U F F L E R   A P I');
    console.info('// ✓ Server ready at http://localhost:3000');
    console.info('// ✓ Docs at http://localhost:3000/api/docs');
    const swaggerYAML = server.swagger({ yaml: true });
    fs.writeFileSync('./swagger.yaml', swaggerYAML);
    console.info('// ✓ swagger.yaml written!');
    console.info('///////////////////////////////////////////');
  } catch (error) {
    console.info(error);
    process.exit(1);
  }
}

main();
