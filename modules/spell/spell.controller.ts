import { createSpellInput, getSpellListInput } from './spell.schema';
import { FastifyReply, FastifyRequest } from 'fastify';
import {
  createSpell,
  getSpell,
  getSpellList,
  updateSpell,
  deleteSpell,
} from './spell.service';
import { handleError, handleResultFound } from '@/utils/errors';

export async function getSpellListHandler(
  request: FastifyRequest<{ Body: getSpellListInput }>,
  reply: FastifyReply
) {
  const { body } = request;
  const { id } = request.user || { id: 0 };
  try {
    const spellList = await getSpellList(id, body);
    return reply.code(200).send({
      list: spellList,
    });
  } catch (error) {
    return handleError(error, reply);
  }
}

export async function getSpellHandler(
  request: FastifyRequest<{
    Params: {
      spellId: string;
    };
  }>,
  reply: FastifyReply
) {
  const { id } = request.user || { id: 0 };
  const spellId = request.params.spellId;
  try {
    const spell = await getSpell(id, parseInt(spellId));
    return handleResultFound(spell, reply);
  } catch (error) {
    return handleError(error, reply);
  }
}

export async function createSpellHandler(
  request: FastifyRequest<{ Body: createSpellInput }>,
  reply: FastifyReply
) {
  try {
    const { body } = request;
    const { id } = request.user;
    const spell = await createSpell(id, body);
    return reply.code(201).send(spell);
  } catch (error) {
    return handleError(error, reply);
  }
}

export async function updateSpellHandler(
  request: FastifyRequest<{
    Params: {
      spellId: string;
    };
    Body: createSpellInput;
  }>,
  reply: FastifyReply
) {
  try {
    const { body } = request;
    const { id } = request.user;
    const spellId = request.params.spellId;
    const spell = await updateSpell(id, parseInt(spellId), body);
    return reply.code(200).send(spell);
  } catch (error) {
    return handleError(error, reply);
  }
}

export async function deleteSpellHandler(
  request: FastifyRequest<{
    Params: {
      spellId: string;
    };
  }>,
  reply: FastifyReply
) {
  try {
    const { id } = request.user;
    const spellId = request.params.spellId;
    await deleteSpell(id, parseInt(spellId));
    return reply.code(204).send();
  } catch (error) {
    return handleError(error, reply);
  }
}
