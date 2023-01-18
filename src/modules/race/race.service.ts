import prisma from '@/utils/prisma';
import { Race, createRaceInput } from './race.schema';

export async function createRace(userid: number, input: createRaceInput) {
  const { object } = input;

  return await prisma.races.create({
    data: {
      userid,
      object,
      game: '5e',
    }
  });
}

export async function getRace(userid: number, id: number) {
  return await prisma.races.findMany({
    select: {
      object: true,
    },
    where: {
      id,
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
  const races = await prisma.races.findMany({
    select: {
      id: true,
      userid: true,
      object: true,
    },
    where: {
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

  return races.map( item => {
    return {
      id: item.id,
      userid: item.userid,
      name: (item.object as Race).name,
    };
  });
}

export async function updateRace(userid: number, id: number, input: createRaceInput) {
  const { object } = input;

  return await prisma.races.updateMany({
    where: {
      id,
      userid,
    },
    data: {
      object,
    }
  });
}

export async function deleteRace(userid: number, id: number) {
  return await prisma.races.deleteMany({
    where: {
      id,
      userid,
    }
  });
}
