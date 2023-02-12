import prisma from '@/utils/prisma';
import { createClassInput, Class, updateClassInput } from './class.schema';

export async function createClass(userid: number, input: createClassInput) {
  const { object, game } = input;

  return await prisma.objects.create({
    data: {
      game,
      type: 3,
      userid,
      name: object.name,
      object,
    }
  });
}

export async function getClass(userid: number, id: number) {
  return await prisma.objects.findMany({
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
  return await prisma.objects.findMany({
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

// TODO: I am not updating lastedited, originaluserid, etc... Find the missing columns and update all the other services
export async function updateClass(userid: number, id: number, input: updateClassInput) {
  const { object } = input;

  return await prisma.objects.updateMany({
    where: {
      id,
      userid,
    },
    data: {
      object,
      name: object.name,
    }
  });
}

export async function deleteClass(userid: number, id: number) {
  return await prisma.objects.deleteMany({
    where: {
      id,
      userid,
    }
  });
}
