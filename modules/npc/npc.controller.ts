import { FastifyReply, FastifyRequest } from 'fastify';
import { createRandomNpc } from './npc.controller.generator';
import { createRandomNpcInput } from './npc.schema';
import { handleError } from '@/utils/errors';

export async function createRandomNpcHandler(
  request: FastifyRequest<{ Body: createRandomNpcInput }>,
  reply: FastifyReply
) {
  try {
    const npc = await createRandomNpc(request, reply);
    return npc;
  } catch (error) {
    return handleError(error, reply);
  }
}

export async function createFourRandomNpcHandler(
  request: FastifyRequest<{ Body: createRandomNpcInput }>,
  reply: FastifyReply
) {
  try {
    const npcs = [];
    for (let i = 0; i < 4; i++) {
      const npc = await createRandomNpc(request, reply);
      if (npc?.npc) {
        npcs.push(npc.npc);
      } else {
        throw new Error('Failed to create npc');
      }
    }
    return { npcs };
  } catch (error) {
    return handleError(error, reply);
  }
}
