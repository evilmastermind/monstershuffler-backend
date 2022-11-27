import { RouteOptions } from "fastify";
import { health } from "@/controllers/healthControllers";

type RouteConfig = Record<string, RouteOptions>;

const routes: RouteConfig = {
  healthCheck: {
    method: "GET",
    url: "/health",
    handler: health
  }
};

export const healthRoutes = Object.values(routes);
