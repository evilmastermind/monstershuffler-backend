import { FastifyInstance } from "fastify";
import { getRandomSurnameHandler } from "./surname.controller";
import { $ref } from "./surname.schema";

async function surnameRoutes(server: FastifyInstance) {
  server.post(
    "/random",
    {
      schema: {
        summary: "Returns a random surname.",
        description:
          "Returns a random surname, which is a string like 'Aldric' or 'Aldric the Brave'.",
        body: $ref("getRandomSurnameSchema"),
        tags: ["surnames"],
        response: {
          200: $ref("getRandomSurnameResponseSchema"),
        },
      },
    },
    getRandomSurnameHandler
  );
}

export default surnameRoutes;
