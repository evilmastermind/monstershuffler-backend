import { createCharacterInput } from './character.schema';
import { FastifyReply, FastifyRequest } from 'fastify';
import {
  createCharacter,
  getCharacter,
  getCharacterList,
  updateCharacter,
  deleteCharacter,
} from './character.service';
import { handleError } from '@/utils/errors';

export async function getCharacterListHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = request.user || { id: 0 };
  try {
    const characterList = await getCharacterList(id);
    return reply.code(200).send({
      list: characterList,
    });
  } catch (error) {
    return handleError(error, reply);
  }
}

export async function getCharacterHandler(
  request: FastifyRequest<{
    Params: {
      characterId: string;
    };
  }>,
  reply: FastifyReply
) {
  const { id } = request.user || { id: 0 };
  const characterId = request.params.characterId;
  try {
    const characterObject = await getCharacter(id, parseInt(characterId));
    return reply.code(200).send(characterObject[0]);
  } catch (error) {
    return handleError(error, reply);
  }
}

export async function createCharacterHandler(
  request: FastifyRequest<{ Body: createCharacterInput }>,
  reply: FastifyReply
) {
  try {
    const { body } = request;
    const { id } = request.user;
    const characterObject = await createCharacter(id, body);
    return reply.code(201).send(characterObject);
  } catch (error) {
    return handleError(error, reply);
  }
}

export async function updateCharacterHandler(
  request: FastifyRequest<{
    Params: {
      characterId: string;
    };
    Body: createCharacterInput;
  }>,
  reply: FastifyReply
) {
  try {
    const { id } = request.user;
    const { body } = request;
    const characterId = request.params.characterId;
    const characterObject = await updateCharacter(
      id,
      parseInt(characterId),
      body
    );
    return reply.code(200).send(characterObject);
  } catch (error) {
    return handleError(error, reply);
  }
}

export async function deleteCharacterHandler(
  request: FastifyRequest<{
    Params: {
      characterId: string;
    };
  }>,
  reply: FastifyReply
) {
  try {
    const { id } = request.user;
    const characterId = request.params.characterId;
    const characterObject = await deleteCharacter(id, parseInt(characterId));
    return reply.code(200).send(characterObject);
  } catch (error) {
    return handleError(error, reply);
  }
}
