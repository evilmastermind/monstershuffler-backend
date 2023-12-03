import { FastifyReply, FastifyRequest } from 'fastify';
import { createRandomNpc } from './npc.controller.generator';
import { PostRandomNpcInput } from './npc.schema';
import { handleError } from '@/utils/errors';
import { getRaceWithVariantsList } from '../race/race.service';
import { getClassWithVariantsList } from '../class/class.service';
import { getBackgroundList } from '../background/background.service';

export async function createRandomNpcHandler(
  request: FastifyRequest<{ Body: PostRandomNpcInput }>,
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
  request: FastifyRequest<{ Body: PostRandomNpcInput }>,
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

export async function getGeneratorDataHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { id } = request.user || { id: 0 };
    const racesWithVariants = await getRaceWithVariantsList(id);
    const classesWithVariants = await getClassWithVariantsList(id);
    const backgrounds = await getBackgroundList(id);
    return reply.code(200).send({
      races: racesWithVariants?.list || [],
      classes: classesWithVariants?.list || [],
      backgrounds: backgrounds || [],
    });
  } catch (error) {
    return handleError(error, reply);
  }
}
