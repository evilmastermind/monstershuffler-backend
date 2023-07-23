import { FastifyReply, FastifyRequest } from "fastify";
import { getRandomCharacterhook } from "./characterhook.service";
import { handleError } from "@/utils/errors";

export async function getRandomCharacterhookHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const Characterhook = await getRandomCharacterhook();
    return reply.code(200).send(Characterhook);
  } catch (error) {
    return handleError(error, reply);
  }
}
