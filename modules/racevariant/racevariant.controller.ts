import {
  PostRacevariantBody,
  PutRacevariantBody,
} from './racevariant.schema';
import { FastifyReply, FastifyRequest } from 'fastify';
import {
  createRacevariant,
  getRacevariant,
  getRandomRacevariant,
  getRacevariantList,
  updateRacevariant,
  deleteRacevariant,
} from './racevariant.service';
import { handleError, handleResultFound } from '@/utils/errors';

export async function getRacevariantListHandler(
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
    const racevariantList = await getRacevariantList(id, parseInt(raceId));
    return reply.code(200).send({
      list: racevariantList,
    });
  } catch (error) {
    return handleError(error, reply);
  }
}

export async function getRacevariantHandler(
  request: FastifyRequest<{
    Params: {
      racevariantId: string;
    };
  }>,
  reply: FastifyReply
) {
  const { id } = request.user || { id: 0 };
  const racevariantId = request.params.racevariantId;
  try {
    const racevariantObject = await getRacevariant(id, parseInt(racevariantId));
    return handleResultFound(racevariantObject, reply);
  } catch (error) {
    return handleError(error, reply);
  }
}

export async function getRandomRacevariantHandler(
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
    const racevariantObject = await getRandomRacevariant(id, parseInt(raceId));
    return handleResultFound(racevariantObject, reply);
  } catch (error) {
    return handleError(error, reply);
  }
}

export async function createRacevariantHandler(
  request: FastifyRequest<{ Body: PostRacevariantBody }>,
  reply: FastifyReply
) {
  try {
    const { body } = request;
    const { id } = request.user;
    const racevariantObject = await createRacevariant(id, body);
    return reply.code(201).send(racevariantObject);
  } catch (error) {
    return handleError(error, reply);
  }
}

export async function updateRacevariantHandler(
  request: FastifyRequest<{
    Params: {
      racevariantId: string;
    };
    Body: PutRacevariantBody;
  }>,
  reply: FastifyReply
) {
  try {
    const { id } = request.user;
    const { body } = request;
    const racevariantId = request.params.racevariantId;
    const racevariantObject = await updateRacevariant(
      id,
      parseInt(racevariantId),
      body
    );
    return reply.code(200).send(racevariantObject);
  } catch (error) {
    return handleError(error, reply);
  }
}

export async function deleteRacevariantHandler(
  request: FastifyRequest<{
    Params: {
      racevariantId: string;
    };
  }>,
  reply: FastifyReply
) {
  try {
    const { id } = request.user;
    const racevariantId = request.params.racevariantId;
    const racevariantObject = await deleteRacevariant(
      id,
      parseInt(racevariantId)
    );
    return reply.code(200).send(racevariantObject);
  } catch (error) {
    return handleError(error, reply);
  }
}
