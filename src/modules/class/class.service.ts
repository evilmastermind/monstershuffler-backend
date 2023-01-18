import prisma from '@/utils/prisma';
import { createClassInput, Class } from './class.schema';

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

export async function getClassList(userid: number) {
  const classes = await prisma.classes.findMany({
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

  return classes.map( item => {
    return {
      id: item.id,
      userid: item.userid,
      name: (item.object as Class).name,
    };
  });
}

export async function updateClass(userid: number, id: number, input: createClassInput) {
  const { object } = input;

  return await prisma.classes.updateMany({
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
  return await prisma.classes.deleteMany({
    where: {
      id,
      userid,
    }
  });
}
