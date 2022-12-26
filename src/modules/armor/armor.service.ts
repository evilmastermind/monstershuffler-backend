import prisma from '@/utils/prisma';
import { createArmorInput } from './armor.schema';

export async function createArmor(userid: number, input: createArmorInput) {
  const { object } = input;

  return await prisma.armor.create({
    data: {
      userid,
      name: object.name,
      object
    }
  });
}

export async function getArmor(userid: number, id: number) {

  return await prisma.armor.findMany({
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
  return await prisma.armor.findMany({
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

export async function updateArmor(userid: number, id: number, input: createArmorInput) {
  const { object } = input;

  await prisma.armor.updateMany({
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
  return await prisma.armor.deleteMany({
    where: {
      id,
      userid
    }
  });
}