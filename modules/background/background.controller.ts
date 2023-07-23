import { createBackgroundInput } from "./background.schema";
import { FastifyReply, FastifyRequest } from "fastify";
import {
  createBackground,
  getBackground,
  getRandomBackground,
  getBackgroundList,
  updateBackground,
  deleteBackground,
} from "./background.service";
import { handleError } from "@/utils/errors";

export async function getBackgroundListHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = request.user || { id: 0 };
  try {
    const backgroundList = await getBackgroundList(id);
    return reply.code(200).send({
      list: backgroundList,
    });
  } catch (error) {
    return handleError(error, reply);
  }
}

export async function getBackgroundHandler(
  request: FastifyRequest<{
    Params: {
      backgroundId: string;
    };
  }>,
  reply: FastifyReply
) {
  const { id } = request.user || { id: 0 };
  const backgroundId = request.params.backgroundId;
  try {
    const backgroundObject = await getBackground(id, parseInt(backgroundId));
    return reply.code(200).send(backgroundObject);
  } catch (error) {
    return handleError(error, reply);
  }
}

export async function getRandomBackgroundHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = request.user || { id: 0 };
  try {
    const backgroundObject = await getRandomBackground(id);
    return reply.code(200).send(backgroundObject);
  } catch (error) {
    return handleError(error, reply);
  }
}

export async function createBackgroundHandler(
  request: FastifyRequest<{ Body: createBackgroundInput }>,
  reply: FastifyReply
) {
  try {
    const { body } = request;
    const { id } = request.user;
    const backgroundObject = await createBackground(id, body);
    return reply.code(201).send(backgroundObject);
  } catch (error) {
    return handleError(error, reply);
  }
}

export async function updateBackgroundHandler(
  request: FastifyRequest<{
    Params: {
      backgroundId: string;
    };
    Body: createBackgroundInput;
  }>,
  reply: FastifyReply
) {
  try {
    const { body } = request;
    const { id } = request.user;
    const backgroundId = request.params.backgroundId;
    const response = await updateBackground(id, parseInt(backgroundId), body);
    return reply.code(200).send(response);
  } catch (error) {
    return handleError(error, reply);
  }
}

export async function deleteBackgroundHandler(
  request: FastifyRequest<{
    Params: {
      backgroundId: string;
    };
  }>,
  reply: FastifyReply
) {
  try {
    const { id } = request.user;
    const backgroundId = request.params.backgroundId;
    const response = await deleteBackground(id, parseInt(backgroundId));
    return reply.code(204).send(response);
  } catch (error) {
    return handleError(error, reply);
  }
}
