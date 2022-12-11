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


export async function getArmor(input: getArmorInput) {
  const { userid, name } = input;

  return await prisma.armor.findUnique({
    where: {
      userid_name: {
        userid,
        name
      }
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
    }
  });
}