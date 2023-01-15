import prisma from '@/utils/prisma';
import { createClassvariantInput, getClassvariantListSchema } from './classvariant.schema';

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
  return await prisma.classvariants.findMany({
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

export async function getClassvariantList(userid: number, input: getClassvariantListSchema) {
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

  return classResult.classvariants.map( item => {
    return {
      id: item.id,
      userid: item.userid,
      name: item.object?.name || 'Classvariant Name',
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
