import prisma from '@/utils/prisma';
import { createArmorInput, getArmorInput } from './armor.schema';

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