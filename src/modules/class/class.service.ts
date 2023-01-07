import prisma from '@/utils/prisma';
import { createClassInput } from './class.schema';

export async function createClass(userid: number, input: createClassInput) {
  const { object } = input;

  return await prisma.classes.create({
    data: {
      userid,
      object,
      game: '5e',
    }
  });
}

export async function getClass(userid: number, id: number) {
  return await prisma.classes.findMany({
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

export async function getClassList(userid: number) {
  return await prisma.classes.findMany({
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
}

export async function updateClass(userid: number, id: number, input: createClassInput) {
  const { object } = input;

  await prisma.classes.updateMany({
    where: {
      id,
      userid,
    },
    data: {
      object,
    }
  });
}

export async function deleteClass(userid: number, id: number) {
  await prisma.classes.deleteMany({
    where: {
      id,
      userid,
    }
  });
}
