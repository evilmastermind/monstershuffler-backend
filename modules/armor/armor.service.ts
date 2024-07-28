import prisma from '@/utils/prisma';
import { PostArmorInput, PutArmorInput } from './armor.schema';
import { Armor } from 'monstershuffler-shared';

export async function createArmor(userid: number, input: PostArmorInput) {
  const { object, game } = input;

  return await prisma.objects.create({
    data: {
      type: 1002,
      userid,
      game,
      name: object.name,
      object,
    },
  });
}

export async function getArmor(userid: number, id: number) {
  const array = await prisma.objects.findMany({
    select: {
      object: true,
      id: true,
    },
    where: {
      id,
      type: 1002,
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
    const object = array[0].object as Armor;
    if (object) {
      object.id = array[0].id;
    }
    return array[0];
  }
  return null;
}

export async function getArmorList(userid: number) {
  return await prisma.objects.findMany({
    select: {
      id: true,
      userid: true,
      name: true,
    },
    where: {
      type: 1002,
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

export async function updateArmor(
  userid: number,
  id: number,
  input: PutArmorInput
) {
  const { object } = input;

  await prisma.objects.updateMany({
    where: {
      id,
      userid,
      type: 1002,
    },
    data: {
      name: object.name,
      object,
    },
  });

  return await getArmor(userid, id);
}

export async function deleteArmor(userid: number, id: number) {
  return await prisma.objects.deleteMany({
    where: {
      id,
      userid,
      type: 1002,
    },
  });
}
