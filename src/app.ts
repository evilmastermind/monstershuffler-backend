import 'module-alias/register';
import Fastify, { FastifyRequest, FastifyReply } from 'fastify';
import Sensible from '@fastify/sensible';
import fjwt from '@fastify/jwt';
import userRoutes from './modules/user/user.route';
import { userSchemas } from '@/modules/user/user.schema';

export const server = Fastify();

server
  .register(fjwt, {
    secret: 'ero09ysgpsdfui49yomama03lsdjf98234'
  })
  .register(Sensible)
  .decorate(
    'authenticate', 
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        await request.jwtVerify();
      } catch (error) { 
        return reply.send(error);
      }
    }
  );


server.get('/health', async function () {
  return { status: 'ok' };
});

async function main() {
  try {

    for(const schema of userSchemas) {
      server.addSchema(schema);
    }
    
    server.register(userRoutes, { prefix: 'api/users' });

    await server.listen({ port: 3000, host: '0.0.0.0' });

    console.log('server ready at http://localhost:3000');
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}




main();