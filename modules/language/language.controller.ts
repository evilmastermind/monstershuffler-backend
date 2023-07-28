import { createLanguageInput } from './language.schema';
import { FastifyReply, FastifyRequest } from 'fastify';
import {
  createLanguage,
  getLanguageList,
  updateLanguage,
  deleteLanguage,
} from './language.service';
import { handleError } from '@/utils/errors';

export async function getLanguageListHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = request.user || { id: 0 };
  try {
    const languageList = await getLanguageList(id);
    return reply.code(200).send({
      list: languageList,
    });
  } catch (error) {
    return handleError(error, reply);
  }
}

export async function createLanguageHandler(
  request: FastifyRequest<{ Body: createLanguageInput }>,
  reply: FastifyReply
) {
  try {
    const { body } = request;
    const { id } = request.user;
    const language = await createLanguage(id, body);
    return reply.code(201).send(language);
  } catch (error) {
    return handleError(error, reply);
  }
}

export async function updateLanguageHandler(
  request: FastifyRequest<{
    Params: {
      languageId: string;
    };
    Body: createLanguageInput;
  }>,
  reply: FastifyReply
) {
  try {
    const { body } = request;
    const { id } = request.user;
    const languageId = request.params.languageId;
    const language = await updateLanguage(id, parseInt(languageId), body);
    return reply.code(200).send(language);
  } catch (error) {
    return handleError(error, reply);
  }
}

export async function deleteLanguageHandler(
  request: FastifyRequest<{
    Params: {
      languageId: string;
    };
  }>,
  reply: FastifyReply
) {
  try {
    const { id } = request.user;
    const languageId = request.params.languageId;
    const language = await deleteLanguage(id, parseInt(languageId));
    return reply.code(200).send(language);
  } catch (error) {
    return handleError(error, reply);
  }
}
