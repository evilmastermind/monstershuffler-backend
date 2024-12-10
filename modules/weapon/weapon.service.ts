import prisma from '@/utils/prisma';
import { PostWeaponBody } from './weapon.schema';
import { Weapon } from 'monstershuffler-shared';

export async function createWeapon(userid: number, input: PostWeaponBody) {
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
      id: true,
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
  if (array.length) {
    // add id inside object for each action
    const object = array[0].object as Weapon;
    if (object) {
      object.id = array[0].id;
    }
    return array[0];
  }
  return null;
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
  input: PostWeaponBody
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
