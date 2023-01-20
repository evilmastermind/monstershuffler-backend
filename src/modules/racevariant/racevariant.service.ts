import prisma from '@/utils/prisma';
import { createRacevariantInput } from './racevariant.schema';


export async function createRacevariant(userid: number, input: createRacevariantInput) {
  const { object, raceId } = input;

  // check if race exists and belongs to user
  const raceResult = await prisma.races.findFirst({
    select: {
      id: true,
    },
    where: {
      id: raceId,
      userid,
    }
  });

  if (!raceResult) {
    throw new Error('Race not found');
  }

  return await prisma.racevariants.create({
    data: {
      raceid: raceId,
      name: object.name,
      object
    }
  });
}

export async function getRacevariant(userid: number, id: number) {
  const raceResult = await prisma.races.findMany({
    select: {
      racevariants: {
        select: {
          id: true,
          name: true,
          object: true,
        },
        where: {
          id,
        }
      }
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
    }
  });
  return raceResult[0].racevariants[0];
}

export async function getRacevariantList(userid: number, raceid: number) {
  const raceResult = await prisma.races.findMany({
    select: {
      id: true,
      userid: true,
      racevariants: {
        select: {
          id: true,
          name: true,
        }
      }
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
      id: raceid,
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

  return raceResult[0].racevariants.map( item => {
    return {
      id: item.id,
      raceid,
      userid,
      name: item.name,
    };
  });
}

function getRaceidFromRacevariantid(userid: number, racevariantid: number) {
  return prisma.racevariants.findUnique({
    select: {
      raceid: true,
    },
    where: {
      id: racevariantid,
    }
  });
}

async function doesItBelongToUser(userid: number, racevariantid: number) {
  const { raceid } = await getRaceidFromRacevariantid(userid, racevariantid) || {};
  if (!raceid) { throw new Error('Race not found'); }

  const raceArray = await prisma.races.findMany({
    select: {
      id: true,
    },
    where: {
      id: raceid,
      userid,
    }
  });

  return !!raceArray.length;
}

export async function updateRacevariant(userid: number, id: number, input: createRacevariantInput) {
  const { object } = input;
  const doesItBelong = await doesItBelongToUser(userid, id);
  if(!doesItBelong) { throw new Error('Race not found'); }

  return await prisma.racevariants.updateMany({
    where: {
      id,
    },
    data: {
      object,
    }
  });
}

export async function deleteRacevariant(userid: number, id: number) {
  const doesItBelong = await doesItBelongToUser(userid, id);
  if(!doesItBelong) { throw new Error('Race not found'); }

  return await prisma.racevariants.deleteMany({
    where: {
      id,
    }
  });
}
