import {
  createClassvariantInput,
  updateClassvariantInput,
} from './classvariant.schema';
import { FastifyReply, FastifyRequest } from 'fastify';
import {
  createClassvariant,
  getClassvariant,
  getRandomClassvariant,
  getClassvariantList,
  getClassvariantClassList,
  updateClassvariant,
  deleteClassvariant,
} from './classvariant.service';
import { handleError, handleResultFound } from '@/utils/errors';

export async function getClassvariantClassListHandler(
  request: FastifyRequest<{
    Params: {
      classId: string;
    };
  }>,
  reply: FastifyReply
) {
  const { id } = request.user || { id: 0 };
  const classId = request.params.classId;
  try {
    const classvariantList = await getClassvariantClassList(
      id,
      parseInt(classId)
    );
    return reply.code(200).send({
      list: classvariantList,
    });
  } catch (error) {
    return handleError(error, reply);
  }
}

export async function getClassvariantListHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = request.user || { id: 0 };
  try {
    const classvariantList = await getClassvariantList(id);
    return reply.code(200).send({
      list: classvariantList,
    });
  } catch (error) {
    return handleError(error, reply);
  }
}

export async function getClassvariantHandler(
  request: FastifyRequest<{
    Params: {
      classvariantId: string;
    };
  }>,
  reply: FastifyReply
) {
  const { id } = request.user || { id: 0 };
  const classvariantId = request.params.classvariantId;
  try {
    const classvariantObject = await getClassvariant(
      id,
      parseInt(classvariantId)
    );
    return handleResultFound(classvariantObject, reply);
  } catch (error) {
    return handleError(error, reply);
  }
}

export async function getRandomClassvariantHandler(
  request: FastifyRequest<{
    Params: {
      classId: string;
    };
  }>,
  reply: FastifyReply
) {
  const { id } = request.user || { id: 0 };
  const classId = request.params.classId;
  try {
    const classvariantObject = await getRandomClassvariant(
      id,
      parseInt(classId)
    );
    return handleResultFound(classvariantObject, reply);
  } catch (error) {
    return handleError(error, reply);
  }
}

export async function createClassvariantHandler(
  request: FastifyRequest<{ Body: createClassvariantInput }>,
  reply: FastifyReply
) {
  try {
    const { body } = request;
    const { id } = request.user;
    const classvariantObject = await createClassvariant(id, body);
    return reply.code(201).send(classvariantObject);
  } catch (error) {
    return handleError(error, reply);
  }
}

export async function updateClassvariantHandler(
  request: FastifyRequest<{
    Params: {
      classvariantId: string;
    };
    Body: updateClassvariantInput;
  }>,
  reply: FastifyReply
) {
  try {
    const { id } = request.user;
    const { body } = request;
    const classvariantId = request.params.classvariantId;
    const classvariantObject = await updateClassvariant(
      id,
      parseInt(classvariantId),
      body
    );
    return reply.code(200).send(classvariantObject);
  } catch (error) {
    return handleError(error, reply);
  }
}

export async function deleteClassvariantHandler(
  request: FastifyRequest<{
    Params: {
      classvariantId: string;
    };
  }>,
  reply: FastifyReply
) {
  try {
    const { id } = request.user;
    const classvariantId = request.params.classvariantId;
    const classvariantObject = await deleteClassvariant(
      id,
      parseInt(classvariantId)
    );
    return reply.code(200).send(classvariantObject);
  } catch (error) {
    return handleError(error, reply);
  }
}
