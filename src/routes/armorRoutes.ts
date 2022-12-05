import { RouteOptions } from "fastify";
import { getArmorHandler } from "@/controllers/armorControllers";

type RouteConfig = Record<string, RouteOptions>;

const routes: RouteConfig = {
  getArmor: {
    method: "GET",
    url: "/armor",
    handler: getArmorHandler
  }
};

export const armorhRoutes = Object.values(routes);
