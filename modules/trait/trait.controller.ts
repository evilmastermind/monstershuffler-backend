import { FastifyReply, FastifyRequest } from 'fastify';
import { sGetRandomTraitBody, sGetRandomTraitBodyForAge, getTraitDescription } from './trait.service';
import { handleError, handleResultFound } from '@/utils/errors';
import { sGetRandomTraitBodyInput } from './trait.schema';

export async function sGetRandomTraitBodyHandler(
  request: FastifyRequest<{
    Body: sGetRandomTraitBodyInput;
  }>,
  reply: FastifyReply
) {
  try {
    const { body } = request;
    const trait = await sGetRandomTraitBody(body);
    return handleResultFound(trait, reply);
  } catch (error) {
    return handleError(error, reply);
  }
}

export async function sGetRandomTraitBodyForAgeHandler(
  request: FastifyRequest<{
    Body: sGetRandomTraitBodyInput;
    Params: {
      age: string;
    };
  }>,
  reply: FastifyReply
) {
  try {
    const { body, params } = request;
    const trait = await sGetRandomTraitBodyForAge(body, params.age);
    return handleResultFound(trait, reply);
  } catch (error) {
    return handleError(error, reply);
  }
}

export async function getTraitDescriptionHandler(
  request: FastifyRequest<{
    Params: {
      name: string;
    };
  }>,
  reply: FastifyReply
) {
  try {
    const name = request.params.name;
    const description = await getTraitDescription(name);
    return handleResultFound(description, reply);
  } catch (error) {
    return handleError(error, reply);
  }
}
