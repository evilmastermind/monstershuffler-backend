import { createDamageTypeInput } from './damagetype.schema';
import { FastifyReply, FastifyRequest } from 'fastify';
import {
  createDamageType,
  getDamageTypeList,
  updateDamageType,
  deleteDamageType,
} from './damagetype.service';
import { handleError } from '@/utils/errors';

export async function getDamageTypeListHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = request.user || { id: 0 };
  try {
    const damageTypeList = await getDamageTypeList(id);
    return reply.code(200).send({
      list: damageTypeList,
    });
  } catch (error) {
    return handleError(error, reply);
  }
}

export async function createDamageTypeHandler(
  request: FastifyRequest<{ Body: createDamageTypeInput }>,
  reply: FastifyReply
) {
  try {
    const { body } = request;
    const { id } = request.user;
    const damageType = await createDamageType(id, body);
    return reply.code(201).send(damageType);
  } catch (error) {
    return handleError(error, reply);
  }
}

export async function updateDamageTypeHandler(
  request: FastifyRequest<{
    Params: {
      damageTypeId: string;
    };
    Body: createDamageTypeInput;
  }>,
  reply: FastifyReply
) {
  try {
    const { body } = request;
    const { id } = request.user;
    const damageTypeId = request.params.damageTypeId;
    const damageType = await updateDamageType(id, parseInt(damageTypeId), body);
    return reply.code(200).send(damageType);
  } catch (error) {
    return handleError(error, reply);
  }
}

export async function deleteDamageTypeHandler(
  request: FastifyRequest<{
    Params: {
      damageTypeId: string;
    };
  }>,
  reply: FastifyReply
) {
  try {
    const { id } = request.user;
    const damageTypeId = request.params.damageTypeId;
    const damageType = await deleteDamageType(id, parseInt(damageTypeId));
    return reply.code(200).send(damageType);
  } catch (error) {
    return handleError(error, reply);
  }
}
