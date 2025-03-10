import { PostClassBody, PutClassBody } from './class.schema';
import { FastifyReply, FastifyRequest } from 'fastify';
import {
  createClass,
  getClass,
  getRandomClass,
  getClassList,
  getClassWithVariantsList,
  updateClass,
  deleteClass,
} from './class.service';
import { handleError, handleResultFound } from '@/utils/errors';

export async function getClassListHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = request.user || { id: 0 };
  try {
    const classList = await getClassList(id);
    return reply.code(200).send({
      list: classList,
    });
  } catch (error) {
    return handleError(error, reply);
  }
}

export async function getClassWithVariantsListHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = request.user || { id: 0 };
  try {
    const classList = await getClassWithVariantsList(id);
    return handleResultFound(classList, reply);
  } catch (error) {
    return handleError(error, reply);
  }
}

export async function getClassHandler(
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
    const classObject = await getClass(id, parseInt(classId));
    return handleResultFound(classObject, reply);
  } catch (error) {
    return handleError(error, reply);
  }
}

export async function getRandomClassHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = request.user || { id: 0 };
  try {
    const classObject = await getRandomClass(id);
    return handleResultFound(classObject, reply);
  } catch (error) {
    return handleError(error, reply);
  }
}

export async function createClassHandler(
  request: FastifyRequest<{ Body: PostClassBody }>,
  reply: FastifyReply
) {
  try {
    const { body } = request;
    const { id } = request.user;
    const classObject = await createClass(id, body);
    return reply.code(201).send(classObject);
  } catch (error) {
    return handleError(error, reply);
  }
}

export async function updateClassHandler(
  request: FastifyRequest<{
    Params: {
      classId: string;
    };
    Body: PutClassBody;
  }>,
  reply: FastifyReply
) {
  try {
    const { id } = request.user;
    const { body } = request;
    const classId = request.params.classId;
    const classObject = await updateClass(id, parseInt(classId), body);
    return reply.code(200).send(classObject);
  } catch (error) {
    return handleError(error, reply);
  }
}

export async function deleteClassHandler(
  request: FastifyRequest<{
    Params: {
      classId: string;
    };
  }>,
  reply: FastifyReply
) {
  try {
    const { id } = request.user;
    const classId = request.params.classId;
    const classObject = await deleteClass(id, parseInt(classId));
    return reply.code(200).send(classObject);
  } catch (error) {
    return handleError(error, reply);
  }
}
