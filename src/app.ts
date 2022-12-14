import 'module-alias/register';
import * as dotenv from 'dotenv';
import Fastify, { FastifyRequest, FastifyReply } from 'fastify';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { withRefResolver } from 'fastify-zod';
import Sensible from '@fastify/sensible';
import fjwt from '@fastify/jwt';
import userRoutes from './modules/user/user.route';
import armorRoutes from './modules/armor/armor.route';
import backgroundRoutes from './modules/background/background.route';
import classRoutes from './modules/class/class.route';
import weaponRoutes from './modules/weapon/weapon.route';
import { userSchemas } from '@/modules/user/user.schema';
import { armorSchemas } from '@/modules/armor/armor.schema';
import { backgroundSchemas } from '@/modules/background/background.schema';
import { classSchemas } from '@/modules/class/class.schema';
import { weaponSchemas } from '@/modules/weapon/weapon.schema';
import { version } from '../package.json';
// import { hashPassword } from '@/utils/hash';

dotenv.config();
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
  .decorate(
    'authenticateOptional', 
    async (request: FastifyRequest) => {
      try {
        await request.jwtVerify();
      } catch (error) { 
        return; // keep going without authentication
      }
    }
  )
  // test route
  .get('/health', async function () {
    return { status: 'WORKIN\''  };
  });

async function main() {
  try {
    const schemas = [
      ...userSchemas,
      ...armorSchemas,
      ...backgroundSchemas,
      ...classSchemas,
      ...weaponSchemas
    ];

    for(const schema of schemas) {
      server.addSchema(schema);
    }

    server.register(
      swagger,
      withRefResolver({
        routePrefix: 'api/docs',
        openapi: {
          info: {
            title: 'Monstershuffler API',
            description: 'REST API for monstershuffler.com',
            version,
          }
        }

      })
    );
    server.register(swaggerUi, {
      routePrefix: 'api/docs',
      staticCSP: true,
    });

    server.register(userRoutes, { prefix: 'api/users' });
    server.register(armorRoutes, { prefix: 'api/armor' });
    server.register(backgroundRoutes, { prefix: 'api/backgrounds' });
    server.register(classRoutes, { prefix: 'api/classes' });
    server.register(weaponRoutes, { prefix: 'api/weapons' });
    
    await server.listen({ port: 3000, host: '0.0.0.0' });

    console.log('server ready at http://localhost:3000');
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}




main();
