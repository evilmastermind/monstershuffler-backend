import { createRaceInput, updateRaceInput } from './race.schema';
import { FastifyReply, FastifyRequest } from 'fastify';
import {
  createRace,
  getRace,
  getRaceList,
  getRandomRace,
  getRaceWithVariantsList,
  updateRace,
  deleteRace,
} from './race.service';
import { handleError, handleResultFound } from '@/utils/errors';

export async function getRaceListHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = request.user || { id: 0 };
  try {
    const raceList = await getRaceList(id);
    return reply.code(200).send({
      list: raceList,
    });
  } catch (error) {
    return handleError(error, reply);
  }
}

export async function getRaceWithVariantsListHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = request.user || { id: 0 };
  try {
    const raceList = await getRaceWithVariantsList(id);
    return handleResultFound(raceList, reply);
  } catch (error) {
    return handleError(error, reply);
  }
}

export async function getRaceHandler(
  request: FastifyRequest<{
    Params: {
      raceId: string;
    };
  }>,
  reply: FastifyReply
) {
  const { id } = request.user || { id: 0 };
  const raceId = request.params.raceId;
  try {
    const raceObject = await getRace(id, parseInt(raceId));
    return handleResultFound(raceObject, reply);
  } catch (error) {
    return handleError(error, reply);
  }
}

export async function getRandomRaceHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = request.user || { id: 0 };
  try {
    const raceObject = await getRandomRace(id);
    return handleResultFound(raceObject, reply);
  } catch (error) {
    return handleError(error, reply);
  }
}

export async function createRaceHandler(
  request: FastifyRequest<{ Body: createRaceInput }>,
  reply: FastifyReply
) {
  try {
    const { body } = request;
    const { id } = request.user;
    const raceObject = await createRace(id, body);
    return reply.code(201).send(raceObject);
  } catch (error) {
    return handleError(error, reply);
  }
}

export async function updateRaceHandler(
  request: FastifyRequest<{
    Params: {
      raceId: string;
    };
    Body: updateRaceInput;
  }>,
  reply: FastifyReply
) {
  try {
    const { id } = request.user;
    const { body } = request;
    const raceId = request.params.raceId;
    const raceObject = await updateRace(id, parseInt(raceId), body);
    return reply.code(200).send(raceObject);
  } catch (error) {
    return handleError(error, reply);
  }
}

export async function deleteRaceHandler(
  request: FastifyRequest<{
    Params: {
      raceId: string;
    };
  }>,
  reply: FastifyReply
) {
  try {
    const { id } = request.user;
    const raceId = request.params.raceId;
    const raceObject = await deleteRace(id, parseInt(raceId));
    return reply.code(200).send(raceObject);
  } catch (error) {
    return handleError(error, reply);
  }
}
