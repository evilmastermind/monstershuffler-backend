import prisma from '@/utils/prisma';
import { createWeaponInput } from './weapon.schema';

export async function createWeapon(userid: number, input: createWeaponInput) {
  const { object, game } = input;

  return await prisma.objects.create({
    data: {
      game,
      type: 1001,
      userid,
      name: object.name || '',
      object,
    },
  });
}

export async function getWeapon(userid: number, id: number) {
  const array = await prisma.objects.findMany({
    select: {
      object: true,
    },
    where: {
      id,
      type: 1001,
      OR: [
        {
          userid: 0,
        },
        {
          userid,
        },
      ],
    },
  });
  if (array.length === 0) {
    return null;
  }
  const result = array[0];
  return result;
}

export async function getWeaponList(userid: number) {
  return await prisma.objects.findMany({
    select: {
      id: true,
      userid: true,
      name: true,
    },
    where: {
      type: 1001,
      OR: [
        {
          userid: 0,
        },
        {
          userid,
        },
      ],
    },
    orderBy: [
      {
        userid: 'asc',
      },
      {
        id: 'asc',
      },
    ],
  });
}

export async function updateWeapon(
  userid: number,
  id: number,
  input: createWeaponInput
) {
  const { object } = input;

  return await prisma.objects.updateMany({
    where: {
      id,
      userid,
      type: 1001,
    },
    data: {
      name: object.name,
      object,
    },
  });
}

export async function deleteWeapon(userid: number, id: number) {
  return await prisma.objects.deleteMany({
    where: {
      id,
      userid,
      type: 1001,
    },
  });
}
