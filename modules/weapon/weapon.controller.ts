import { createWeaponInput } from './weapon.schema';
import { FastifyReply, FastifyRequest } from 'fastify';
import {
  createWeapon,
  getWeapon,
  getWeaponList,
  updateWeapon,
  deleteWeapon,
} from './weapon.service';
import { handleError } from '@/utils/errors';

export async function getWeaponListHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = request.user || { id: 0 };
  try {
    const weaponList = await getWeaponList(id);
    return reply.code(200).send({
      list: weaponList,
    });
  } catch (error) {
    return handleError(error, reply);
  }
}

export async function getWeaponHandler(
  request: FastifyRequest<{
    Params: {
      weaponId: string;
    };
  }>,
  reply: FastifyReply
) {
  const { id } = request.user || { id: 0 };
  const weaponId = request.params.weaponId;
  try {
    const weapon = await getWeapon(id, parseInt(weaponId));
    return reply.code(200).send(weapon[0]);
  } catch (error) {
    return handleError(error, reply);
  }
}

export async function createWeaponHandler(
  request: FastifyRequest<{ Body: createWeaponInput }>,
  reply: FastifyReply
) {
  try {
    const { body } = request;
    const { id } = request.user;
    const weapon = await createWeapon(id, body);
    return reply.code(201).send(weapon);
  } catch (error) {
    return handleError(error, reply);
  }
}

export async function updateWeaponHandler(
  request: FastifyRequest<{
    Params: {
      weaponId: string;
    };
    Body: createWeaponInput;
  }>,
  reply: FastifyReply
) {
  try {
    const { id } = request.user;
    const { body } = request;
    const weaponId = request.params.weaponId;
    const response = await updateWeapon(id, parseInt(weaponId), body);
    return reply.code(200).send(response);
  } catch (error) {
    return handleError(error, reply);
  }
}

export async function deleteWeaponHandler(
  request: FastifyRequest<{
    Params: {
      weaponId: string;
    };
  }>,
  reply: FastifyReply
) {
  try {
    const { id } = request.user;
    const weaponId = request.params.weaponId;
    const response = await deleteWeapon(id, parseInt(weaponId));
    return reply.code(200).send(response);
  } catch (error) {
    return handleError(error, reply);
  }
}
