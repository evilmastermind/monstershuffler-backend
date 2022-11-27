import { RouteHandlerMethod } from "fastify";

export const health: RouteHandlerMethod = async (req, res) => {
  res.status(200).send({ monster: "shuffler" });
};