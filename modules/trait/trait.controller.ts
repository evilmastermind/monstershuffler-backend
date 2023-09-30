import { FastifyReply, FastifyRequest } from 'fastify';
import { getRandomTrait, getTraitDescription } from './trait.service';
import { handleError, handleResultFound } from '@/utils/errors';
import { getRandomTraitInput } from './trait.schema';

export async function getRandomTraitHandler(
  request: FastifyRequest<{
    Body: getRandomTraitInput;
  }>,
  reply: FastifyReply
) {
  try {
    const { body } = request;
    const trait = await getRandomTrait(body);
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
