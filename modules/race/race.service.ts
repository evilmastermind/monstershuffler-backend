import prisma from '@/utils/prisma';
import { Race, createRaceInput, updateRaceInput } from './race.schema';

export async function createRace(userid: number, input: createRaceInput) {
  const { object, game } = input;

  return await prisma.objects.create({
    data: {
      userid,
      type: 2,
      game,
      name: object.name,
      object,
    },
  });
}

export async function getRace(userid: number, id: number) {
  const array = await prisma.objects.findMany({
    select: {
      object: true,
      id: true,
    },
    where: {
      id,
      type: 2,
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
    object: result.object as Race,
    id: result.id,
  };
  response.object.id = result.id;
  return response;
}

export async function getRandomRace(userid: number) {
  const raceCount = await prisma.objects.count({
    where: {
      type: 2,
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
  const array = await prisma.objects.findMany({
    skip: Math.floor(Math.random() * raceCount),
    take: 1,
    select: {
      object: true,
      id: true,
    },
    where: {
      type: 2,
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
    object: result.object as Race,
    id: result.id,
  };
  response.object.id = result.id;
  return response;
}

export async function getRaceList(userid: number) {
  return await prisma.objects.findMany({
    select: {
      id: true,
      userid: true,
      name: true,
    },
    where: {
      type: 2,
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

export async function getRaceWithVariantsList(userid: number) {
  const result = prisma.objects.findMany({
    select: {
      id: true,
      userid: true,
      name: true,
      other_objects: {
        select: {
          id: true,
          userid: true,
          name: true,
        },
        where: {
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
            name: 'asc',
          },
        ],
      },
    },
    where: {
      type: 2,
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
        name: 'asc',
      },
    ],
  });
  return result;
}

export async function updateRace(
  userid: number,
  id: number,
  input: updateRaceInput
) {
  const { object, game } = input;

  return await prisma.objects.updateMany({
    where: {
      id,
      userid,
      type: 2,
    },
    data: {
      object,
      game,
      name: object.name,
    },
  });
}

export async function deleteRace(userid: number, id: number) {
  return await prisma.objects.deleteMany({
    where: {
      id,
      userid,
      type: 2,
    },
  });
}
