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
    }
  });
}

export async function getRace(userid: number, id: number) {
  return await prisma.objects.findMany({
    select: {
      object: true,
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
      ]
    }
  });
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
      ]
    },
    orderBy: [
      {
        userid: 'asc',
      },
      {
        id: 'asc',
      }
    ]
  });
}

export async function updateRace(userid: number, id: number, input: updateRaceInput) {
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
    }
  });
}

export async function deleteRace(userid: number, id: number) {
  return await prisma.objects.deleteMany({
    where: {
      id,
      userid,
      type: 2,
    }
  });
}
