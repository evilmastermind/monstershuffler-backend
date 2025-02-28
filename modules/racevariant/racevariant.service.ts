import prisma from '@/utils/prisma';
import {
  Racevariant,
  PostRacevariantBody,
  PutRacevariantBody,
} from './racevariant.schema';

export async function createRacevariant(
  userid: number,
  input: PostRacevariantBody
) {
  const { object, game, raceId } = input;

  // check if race exists and belongs to user
  // TODO: allow users to create race variants for other users' races
  const raceResult = await prisma.objects.findFirst({
    select: {
      id: true,
    },
    where: {
      id: raceId,
      userid,
      type: 2,
    },
  });

  if (!raceResult) {
    throw new Error('Race not found');
  }

  return await prisma.objects.create({
    data: {
      game,
      type: 10002,
      userid,
      name: object.name,
      object,
      variantof: raceId,
    },
  });
}

export async function getRacevariant(userid: number, id: number) {
  const array = await prisma.objects.findMany({
    select: {
      object: true,
      id: true,
      description: true,
    },
    where: {
      id,
      type: 10002,
      OR: [
        {
          userid: 0,
        },
        {
          userid,
        },
      ],
    },
  });
  if (array.length === 0) {
    return null;
  }
  const result = array[0];
  const response = {
    object: result.object as Racevariant,
    id: result.id,
  };
  response.object.id = result.id;
  response.object.description = result.description || '';
  return response;
}

export async function getRandomRacevariant(userid: number, variantof: number) {
  const raceCount = await prisma.objects.count({
    where: {
      type: 10002,
      variantof,
      OR: [
        {
          userid: 0,
        },
        {
          userid,
        },
      ],
    },
  });
  if (raceCount === 0) {
    return null;
  }
  const array = await prisma.objects.findMany({
    skip: Math.floor(Math.random() * raceCount),
    take: 1,
    select: {
      object: true,
      id: true,
    },
    where: {
      type: 10002,
      variantof,
      OR: [
        {
          userid: 0,
        },
        {
          userid,
        },
      ],
    },
  });
  if (array.length === 0) {
    return null;
  }
  const result = array[0];
  const response = {
    object: result.object as Racevariant,
    id: result.id,
  };
  response.object.id = result.id;
  return response;
}

export async function getRacevariantList(userid: number, variantof: number) {
  return await prisma.objects.findMany({
    select: {
      id: true,
      userid: true,
      name: true,
    },
    where: {
      variantof,
      type: 10002,
      OR: [
        {
          userid: 0,
        },
        {
          userid,
        },
      ],
    },
    orderBy: [
      {
        userid: 'asc',
      },
      {
        id: 'asc',
      },
    ],
  });
}

export async function updateRacevariant(
  userid: number,
  id: number,
  input: PutRacevariantBody
) {
  const { object } = input;

  return await prisma.objects.updateMany({
    where: {
      id,
      userid,
      type: 10002,
    },
    data: {
      object,
      name: object.name,
    },
  });
}

export async function deleteRacevariant(userid: number, id: number) {
  return await prisma.objects.deleteMany({
    where: {
      id,
      userid,
      type: 10002,
    },
  });
}
