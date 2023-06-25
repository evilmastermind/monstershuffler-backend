import { FastifyReply, FastifyRequest } from "fastify";
import { getRandomBackground } from "./background.service";
import { handleError } from "@/utils/errors";

export async function getRandomBackgroundHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const background = await getRandomBackground();
    return reply.code(200).send(background);
  } catch (error) {
    return handleError(error, reply);
  }
}
