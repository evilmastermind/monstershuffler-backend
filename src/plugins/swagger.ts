import { FastifyInstance } from "fastify";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import { version } from "~/package.json";


export async function initializeSwagger(app: FastifyInstance) {
  await app.register(swagger, {
    swagger: {
      info: {
        title: "Monstershuffler.com REST API",
        description: "This is a definition of our backend REST API.",
        version: version
      },
      host: "localhost",
      schemes: ["http"],
      consumes: ["application/json"],
      produces: ["application/json"],
      // tags: [
      //   { name: "user", description: "User related end-points" },
      //   { name: "code", description: "Code related end-points" }
      // ],
      // definitions: {
      //   User: {
      //     type: "object",
      //     required: ["id", "email"],
      //     properties: {
      //       id: { type: "string", format: "uuid" },
      //       firstName: { type: "string" },
      //       lastName: { type: "string" },
      //       email: {type: "string", format: "email" }
      //     }
      //   }
      // },
      // securityDefinitions: {
      //   apiKey: {
      //     type: "apiKey",
      //     name: "apiKey",
      //     in: "header"
      //   }
      // }
    }
  });

  await app.register(swaggerUi, {
    routePrefix: "/docs",
    uiConfig: {
      docExpansion: "full",
      deepLinking: false
    },
    uiHooks: {
      onRequest: function (request, reply, next) { next(); },
      preHandler: function (request, reply, next) { next(); }
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
    transformSpecification: (swaggerObject) => { return swaggerObject; },
    transformSpecificationClone: true
  });
}