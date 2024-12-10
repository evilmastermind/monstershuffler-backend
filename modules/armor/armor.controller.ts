import { PostArmorBody } from './armor.schema';
import { FastifyReply, FastifyRequest } from 'fastify';
import {
  createArmor,
  getArmor,
  getArmorList,
  updateArmor,
  deleteArmor,
} from './armor.service';
import { handleError, handleResultFound } from '@/utils/errors';

export async function getArmorListHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = request.user || { id: 0 };
  try {
    const armorList = await getArmorList(id);
    return reply.code(200).send({
      list: armorList,
    });
  } catch (error) {
    return handleError(error, reply);
  }
}

export async function getArmorHandler(
  request: FastifyRequest<{
    Params: {
      armorId: string;
    };
  }>,
  reply: FastifyReply
) {
  const { id } = request.user || { id: 0 };
  const armorId = request.params.armorId;
  try {
    const armor = await getArmor(id, parseInt(armorId));
    return handleResultFound(armor, reply);
  } catch (error) {
    return handleError(error, reply);
  }
}

export async function createArmorHandler(
  request: FastifyRequest<{ Body: PostArmorBody }>,
  reply: FastifyReply
) {
  try {
    const { body } = request;
    const { id } = request.user;
    const armor = await createArmor(id, body);
    return reply.code(201).send(armor);
  } catch (error) {
    return handleError(error, reply);
  }
}

export async function updateArmorHandler(
  request: FastifyRequest<{
    Params: {
      armorId: string;
    };
    Body: PostArmorBody;
  }>,
  reply: FastifyReply
) {
  try {
    const { id } = request.user;
    const { body } = request;
    const armorId = request.params.armorId;
    const armor = await updateArmor(id, parseInt(armorId), body);
    return handleResultFound(armor, reply);
  } catch (error) {
    return handleError(error, reply);
  }
}

export async function deleteArmorHandler(
  request: FastifyRequest<{
    Params: {
      armorId: string;
    };
  }>,
  reply: FastifyReply
) {
  try {
    const { id } = request.user;
    const armorId = request.params.armorId;
    const armor = await deleteArmor(id, parseInt(armorId));
    return reply.code(200).send(armor);
  } catch (error) {
    return handleError(error, reply);
  }
}
