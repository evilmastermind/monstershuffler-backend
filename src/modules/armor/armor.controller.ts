import { createArmorInput } from './armor.schema';
import { FastifyReply, FastifyRequest } from 'fastify';
import { createArmor, getArmor, getArmorList } from './armor.service';
import { handleError } from '@/utils/errors';

export async function createArmorHandler (
  request: FastifyRequest<{Body: createArmorInput }>,
  reply: FastifyReply
) {
  const { body } = request;
  const { id } = request.user;
  try {
    const armor = await createArmor(id, body);
    return reply.code(201).send(armor);
  } catch (error) {
    return handleError(error, reply);
  }
}

export async function getArmorHandler (
  request: FastifyRequest<{
    Params: {
      armorId: string;
    } 
  }>,
  reply: FastifyReply
) {
  const { id } = request.user || { id: 0 };
  const armorId = request.params.armorId;
  try {
    const armor = await getArmor(id, parseInt(armorId));
    return reply.code(200).send(armor);
  } catch (error) {
    return handleError(error, reply);
  }
}

export async function getArmorListHandler (
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = request.user  || { id: 0 };
  try {
    const armorList = await getArmorList(id);
    return reply.code(200).send(armorList);
  } catch (error) {
    return handleError(error, reply);
  }
}