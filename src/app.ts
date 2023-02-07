import 'module-alias/register';
import * as dotenv from 'dotenv';
import Fastify, { FastifyRequest, FastifyReply } from 'fastify';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { withRefResolver } from 'fastify-zod';
import Sensible from '@fastify/sensible';
import fjwt from '@fastify/jwt';
import { actionSchemas } from './modules/action/action.schema';
import { armorSchemas } from '@/modules/armor/armor.schema';
import { backgroundSchemas } from '@/modules/background/background.schema';
import { characterSchemas } from './modules/character/character.schema';
import { classSchemas } from '@/modules/class/class.schema';
import { classvariantSchemas } from './modules/classvariant/classvariant.schema';
import { damageTypeSchemas } from './modules/damagetype/damagetype.schema';
import { folderSchemas } from './modules/folder/folder.schema';
import { languageSchemas } from './modules/language/language.schema';
import { nameSchemas } from './modules/name/name.schema';
import { professionSchemas } from './modules/profession/profession.schema';
import { raceSchemas } from './modules/race/race.schema';
import { racevariantSchemas } from './modules/racevariant/racevariant.schema';
import { templateSchemas } from './modules/template/template.schema';
import { userSchemas } from '@/modules/user/user.schema';
import { version } from '../package.json';
import { weaponSchemas } from '@/modules/weapon/weapon.schema';
import actionRoutes from './modules/action/action.route';
import armorRoutes from './modules/armor/armor.route';
import backgroundRoutes from './modules/background/background.route';
import characterRoutes from './modules/character/character.route';
import classRoutes from './modules/class/class.route';
import classvariantRoutes from './modules/classvariant/classvariant.route';
import damageTypeRoutes from './modules/damagetype/damagetype.route';
import folderRoutes from './modules/folder/folder.route';
import languageRoutes from './modules/language/language.route';
import nameRoutes from './modules/name/name.route';
import professionRoutes from './modules/profession/profession.route';
import raceRoutes from './modules/race/race.route';
import racevariantRoutes from './modules/racevariant/racevariant.route';
import templateRoutes from './modules/template/template.route';
import userRoutes from './modules/user/user.route';
import weaponRoutes from './modules/weapon/weapon.route';
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
      ...actionSchemas,
      ...armorSchemas,
      ...backgroundSchemas,
      ...characterSchemas,
      ...classSchemas,
      ...classvariantSchemas,
      ...damageTypeSchemas,
      ...folderSchemas,
      ...languageSchemas,
      ...nameSchemas,
      ...professionSchemas,
      ...raceSchemas,
      ...racevariantSchemas,
      ...templateSchemas,
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
          },
          tags: [
            { name: 'users', description: 'The users\' account. ' },
            { name: 'actions', description: 'Retrieve the official actions of srd monsters, classes and races to build your creatures faster. Save your custom actions and share them with other users.' },
            { name: 'class variants', description: 'Class variants can be subclasses, archetypes, variants or customizations that add new features on top of their base class.' },
          ],
        }

      })
    );
    server.register(swaggerUi, {
      routePrefix: 'api/docs',
      staticCSP: true,
    });

    server.register(userRoutes, { prefix: 'api/users' });
    server.register(actionRoutes, { prefix: 'api/actions' });
    server.register(armorRoutes, { prefix: 'api/armor' });
    server.register(backgroundRoutes, { prefix: 'api/backgrounds' });
    server.register(characterRoutes, { prefix: 'api/characters' });
    server.register(classRoutes, { prefix: 'api/classes' });
    server.register(classvariantRoutes, { prefix: 'api/classvariants' });
    server.register(damageTypeRoutes, { prefix: 'api/damagetypes' });
    server.register(folderRoutes, { prefix: 'api/folders' });
    server.register(languageRoutes, { prefix: 'api/languages' });
    server.register(nameRoutes, { prefix: 'api/names' });
    server.register(professionRoutes, { prefix: 'api/professions' });
    server.register(raceRoutes, { prefix: 'api/races' });
    server.register(racevariantRoutes, { prefix: 'api/racevariants' });
    server.register(templateRoutes, { prefix: 'api/templates' });
    server.register(weaponRoutes, { prefix: 'api/weapons' });
    
    await server.listen({ port: 3000, host: '0.0.0.0' });

    console.log('server ready at http://localhost:3000');
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}




main();
