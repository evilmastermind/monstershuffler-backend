import { FastifyInstance } from "fastify";
import { convertObjectsHandler } from "./converter.controller";
import { jwtHeaderRequired } from "@/schemas";

async function converterRoutes(server: FastifyInstance) {
  server.get(
    "/converter",
    {
      preHandler: [server.authenticate],
      schema: {
        summary:
          "Converts objects from the old monstershuffler format to the new one.",
        description:
          "Converts objects from the old monstershuffler format to the new one.",
        headers: jwtHeaderRequired,
        tags: ["converter"],
        response: 200,
      },
    },
    convertObjectsHandler
  );
}

export default converterRoutes;
