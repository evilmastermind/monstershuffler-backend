import prisma from '@/utils/prisma';
import { createArmorInput, updateArmorInput } from './armor.schema';

export async function createArmor(userid: number, input: createArmorInput) {
  const { object, game } = input;

  return await prisma.objects.create({
    data: {
      type: 1002,
      userid,
      game,
      name: object.name,
      object
    }
  });
}

export async function getArmor(userid: number, id: number) {

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

export async function getArmorList(userid: number) {
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

export async function updateArmor(userid: number, id: number, input: updateArmorInput) {
  const { object } = input;

  await prisma.objects.updateMany({
    where: {
      id,
      userid
    },
    data: {
      name: object.name,
      object
    }
  });

  return await getArmor(userid, id);
}

export async function deleteArmor(userid: number, id: number) {
  return await prisma.objects.deleteMany({
    where: {
      id,
      userid
    }
  });
}
