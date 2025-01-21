import dotenv from 'dotenv';
dotenv.config();
import path from 'path';
// @ts-expect-error module-alias is not typed
import moduleAlias from 'module-alias';
////
moduleAlias.addAliases({
  '@': path.join(__dirname),
  '~': path.join(__dirname, 'modules'),
});
////

import 'module-alias/register';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import {FastifySSEPlugin} from 'fastify-sse-v2';
import cors from '@fastify/cors';
import Fastify, { FastifyRequest, FastifyReply, FastifyError } from 'fastify';
import fjwt from '@fastify/jwt';
import rateLimiter from '@fastify/rate-limit';
import Sensible from '@fastify/sensible';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import helmet from '@fastify/helmet';
import underPressure from '@fastify/under-pressure';
import swaggerSettings from '@/plugins/swagger';
import mailerSettings from '@/plugins/mailer';
import { routes } from '@/modules';
import { runMigrations, scheduleDbMaintenance } from './db';
import events from 'events';

export const server = Fastify({
  logger: true,
  ajv: {
    customOptions: {
      allowUnionTypes: true,
    }
  } 
});
// export const server = Fastify();


events.EventEmitter.defaultMaxListeners = parseInt(process.env.MAX_LISTENERS || '100');

const secret = process.env.JWT_SECRET;
if (secret === undefined) {
  console.error('Missing JWT_SECRET in .env');
  process.exit(1);
}

server
  // json schema transform
  .setValidatorCompiler(validatorCompiler)
  .setSerializerCompiler(serializerCompiler)
  // cors
  .register(cors, {
    origin: true,
  })
  // rate limiter
  .register(rateLimiter, {
    global : true,
    max: 100,
    timeWindow: '1 minute',
  })
  // jwt
  .register(fjwt, {
    secret: secret,
  })
  // default responses & other tools
  .register(Sensible)
  // mailer
  // eslint-disable-next-line
  .register(require('fastify-mailer'), mailerSettings)
  // SSE
  .register(FastifySSEPlugin)
  // helmet
  .register(helmet)
  // under pressure
  .register(underPressure, {
    maxEventLoopDelay: 1000,
    maxHeapUsedBytes: 1000000000,
    maxRssBytes: 1000000000,
    maxEventLoopUtilization: 0.98,
    message: '♕👨‍🎤 Under pressure 👨‍🎤♕',
  })
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
      const clients = process.env.CLIENTS?.split(',');
      const header = request.headers.origin || request.headers.referer;

      if (!header || !clients?.includes(header)) {
        reply.status(403).send({ error: `This request is available only to specific addresses. Your address: ${header}. Please contact info@monstershuffler.com to request access.` });
      } else {
        done();
      }
    }
  )
  // test route
  .get('/api/health', async function () {
    if (server.isUnderPressure()) {
      return {
        status: `♕👨‍🎤 Under pressure 👨‍🎤♕ Mem: ${server.memoryUsage()}`,
      };
    }
    return { status: '\'TIS WORKIN\', CHIEF!' };
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
    await runMigrations();
    await scheduleDbMaintenance();

    server.register(swagger, swaggerSettings);
    server.register(swaggerUi, {
      routePrefix: 'api/docs',
      staticCSP: true,
    });


    server.after(() => { for (const route of routes) {
      server.register(route.routes, { prefix: route.prefix });
    }});  

    await server.ready();

    await server.listen({ port: 3000, host: '0.0.0.0' });
    console.info('///////////////////////////////////////////');
    console.info('// M O N S T E R S H U F F L E R   A P I');
    console.info('// ✓ Server ready at http://localhost:3000');
    console.info('// ✓ Docs at http://localhost:3000/api/docs');
    // const swaggerYAML = server.swagger({ yaml: true });
    // fs.writeFileSync('./swagger.yaml', swaggerYAML);
    // console.info('// ✓ swagger.yaml written!');
    console.info('///////////////////////////////////////////');
  } catch (error) {
    console.info(error);
    process.exit(1);
  }
}

main();
