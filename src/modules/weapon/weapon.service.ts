import prisma from '@/utils/prisma';
import { createWeaponInput } from './weapon.schema';

export async function createWeapon(userid: number, input: createWeaponInput) {
  const { object } = input;

  return await prisma.weapons.create({
    data: {
      userid,
      name: object.name,
      object
    }
  });
}

export async function getWeapon(userid: number, id: number) {

  return await prisma.weapons.findMany({
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

export async function getWeaponList(userid: number) {
  return await prisma.weapons.findMany({
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

export async function updateWeapon(userid: number, id: number, input: createWeaponInput) {
  const { object } = input;

  await prisma.weapons.updateMany({
    where: {
      id,
      userid
    },
    data: {
      name: object.name,
      object
    }
  });

  return await getWeapon(userid, id);
}

export async function deleteWeapon(userid: number, id: number) {
  return await prisma.weapons.deleteMany({
    where: {
      id,
      userid
    }
  });
}