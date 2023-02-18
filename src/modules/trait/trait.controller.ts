import { FastifyReply, FastifyRequest } from 'fastify';
import { getRandomTrait, getTraitDescription } from './trait.service';
import { handleError } from '@/utils/errors';

export async function getRandomTraitHandler (
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const trait = await getRandomTrait();
    return reply.code(200).send(trait);
  } catch (error) {
    return handleError(error, reply);
  }
}

export async function getTraitDescriptionHandler (
  request: FastifyRequest<{
    Params: {
      name: string;
    }
  }>,
  reply: FastifyReply
) {
  try {
    const name = request.params.name;
    const description = await getTraitDescription(name);
    return reply.code(200).send(description);
  } catch (error) {
    return handleError(error, reply);
  }
}
