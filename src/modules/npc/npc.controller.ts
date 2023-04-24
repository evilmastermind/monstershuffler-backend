import { createRandomNpcInput } from './npc.schema';
import { FastifyReply, FastifyRequest } from 'fastify';
import { getRace, getRandomRace } from '@/modules/race/race.service';
import { handleError } from '@/utils/errors';
import { random } from '@/utils/functions';

export async function createRandomNpcHandler (
  request: FastifyRequest<{Body: createRandomNpcInput }>,
  reply: FastifyReply
) {
  const { id } = request.user || { id: 0 };
  const { levelType, classType, classId, primaryRaceId, secondaryRaceId, primaryRacePercentage, secondaryRacePercentage } = request.body;
  try {
    const level = calculateLevel(levelType);
    const race = await calculateRace(id, primaryRaceId, secondaryRaceId, primaryRacePercentage, secondaryRacePercentage);

    return reply.code(200).send({
      npc
    });
  } catch (error) {
    return handleError(error, reply);
  }
}

// TODO: I also need to check if the race/class/whatever is enabled for the npc generator (checkbox)
async function calculateRace(id: number, primaryRaceId: number | undefined, secondaryRaceId: number | undefined, primaryRacePercentage: number | undefined = 0, secondaryRacePercentage: number | undefined = 0) {
  if (!primaryRaceId && !secondaryRaceId) {
    return null;
  }
  const percentage = random(1, 100);
  if (primaryRaceId && (percentage <= primaryRacePercentage)) {
    return (await getRace(id, primaryRaceId)).object;
  } else if (secondaryRaceId && (percentage <= primaryRacePercentage + secondaryRacePercentage)) {
    return (await getRace(id, secondaryRaceId)).object;
  }
  return (await getRandomRace(id)).object;
}


function calculateLevel(levelType = 'random') {
  switch (levelType) {
  case 'randomPeasantsMostly': {
    const randomValue = Math.floor(30/(Math.random() * 150 + 1) + 1);
    return randomValue > 20 ? 20 : randomValue;
  }
  default:
    return Math.floor(Math.random() * 20 + 1);
  }
}
