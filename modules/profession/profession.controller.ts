import { createProfessionInput } from "./profession.schema";
import { FastifyReply, FastifyRequest } from "fastify";
import {
  createProfession,
  getProfession,
  getRandomProfession,
  getProfessionList,
  updateProfession,
  deleteProfession,
} from "./profession.service";
import { handleError } from "@/utils/errors";

export async function getProfessionListHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = request.user || { id: 0 };
  try {
    const professionList = await getProfessionList(id);
    return reply.code(200).send({
      list: professionList,
    });
  } catch (error) {
    return handleError(error, reply);
  }
}

export async function getProfessionHandler(
  request: FastifyRequest<{
    Params: {
      professionId: string;
    };
  }>,
  reply: FastifyReply
) {
  const { id } = request.user || { id: 0 };
  const professionId = request.params.professionId;
  try {
    const professionObject = await getProfession(id, parseInt(professionId));
    return reply.code(200).send(professionObject);
  } catch (error) {
    return handleError(error, reply);
  }
}

export async function getRandomProfessionHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = request.user || { id: 0 };
  try {
    const professionObject = await getRandomProfession(id);
    return reply.code(200).send(professionObject);
  } catch (error) {
    return handleError(error, reply);
  }
}

export async function createProfessionHandler(
  request: FastifyRequest<{ Body: createProfessionInput }>,
  reply: FastifyReply
) {
  try {
    const { body } = request;
    const { id } = request.user;
    const professionObject = await createProfession(id, body);
    return reply.code(201).send(professionObject);
  } catch (error) {
    return handleError(error, reply);
  }
}

export async function updateProfessionHandler(
  request: FastifyRequest<{
    Params: {
      professionId: string;
    };
    Body: createProfessionInput;
  }>,
  reply: FastifyReply
) {
  try {
    const { body } = request;
    const { id } = request.user;
    const professionId = request.params.professionId;
    const response = await updateProfession(id, parseInt(professionId), body);
    return reply.code(200).send(response);
  } catch (error) {
    return handleError(error, reply);
  }
}

export async function deleteProfessionHandler(
  request: FastifyRequest<{
    Params: {
      professionId: string;
    };
  }>,
  reply: FastifyReply
) {
  try {
    const { id } = request.user;
    const professionId = request.params.professionId;
    const response = await deleteProfession(id, parseInt(professionId));
    return reply.code(204).send(response);
  } catch (error) {
    return handleError(error, reply);
  }
}
