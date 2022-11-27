import { FastifyInstance, FastifyPluginCallback } from "fastify";
import { healthRoutes } from "@/routes/healthRoutes";

export const router: FastifyPluginCallback = (
  fastify: FastifyInstance,
  _,
  next
) => {

  const routes = [  ...healthRoutes ];

  for (const route of routes) {
    fastify.route(route);
  }

  next();
};