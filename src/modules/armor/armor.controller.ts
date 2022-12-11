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

export async function getArmorInput