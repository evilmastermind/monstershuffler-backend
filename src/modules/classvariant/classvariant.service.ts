import prisma from '@/utils/prisma';
import { createClassvariantInput } from './classvariant.schema';

// TODO: these queries are still incomplete

export async function createClassvariant(userid: number, input: createClassvariantInput) {
  const { object } = input;

  return await prisma.classvariants.create({
    data: {
      userid,
      object,
      game: '5e',
    }
  });
}

export async function getClassvariant(userid: number, id: number) {
  const classResult = await prisma.classes.findMany({
    select: {
      classvariants: {
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

  return classResult[0].classvariants[0];
}

export async function getClassvariantList(userid: number, classid: number) {
  const classResult = await prisma.classes.findMany({
    select: {
      id: true,
      userid: true,
      classvariants: {
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
      id: classid,
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

  return classResult[0].classvariants.map( item => {
    return {
      id: item.id,
      classid,
      userid,
      name: item.name || 'Classvariant Name',
    };
  });
}

export async function updateClassvariant(userid: number, id: number, input: createClassvariantInput) {
  const { object } = input;

  return await prisma.classvariants.updateMany({
    where: {
      id,
      userid,
    },
    data: {
      object,
    }
  });
}

export async function deleteClassvariant(userid: number, id: number) {
  return await prisma.classvariants.deleteMany({
    where: {
      id,
      userid,
    }
  });
}
