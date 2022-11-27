import "module-alias/register";
import Fastify from "fastify";
import { router } from "@/routes/index";
import { initializeSwagger } from "@/plugins/swagger";

const fastify = Fastify({
  logger: true,
});


async function startTheServer() {

  await initializeSwagger(fastify);
  await fastify.register(router);
  await fastify.ready();

  fastify.listen({ port: 3000 }, function (err) {
    if (err) {
      fastify.log.error(err);
      process.exit(1);
    }
  });
}

startTheServer();







