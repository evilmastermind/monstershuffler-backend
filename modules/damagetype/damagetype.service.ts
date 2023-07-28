import prisma from '@/utils/prisma';
import { createDamageTypeInput } from './damagetype.schema';

export async function createDamageType(
  userid: number,
  input: createDamageTypeInput
) {
  const { name, description } = input;

  return await prisma.damagetypes.create({
    data: {
      userid,
      name,
      description,
    },
  });
}

export async function getDamageTypeList(userid: number) {
  return await prisma.damagetypes.findMany({
    where: {
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

export async function updateDamageType(
  userid: number,
  id: number,
  input: createDamageTypeInput
) {
  const { name, description } = input;

  return await prisma.damagetypes.updateMany({
    where: {
      id,
      userid,
    },
    data: {
      name,
      description,
    },
  });
}

export async function deleteDamageType(userid: number, id: number) {
  return await prisma.damagetypes.deleteMany({
    where: {
      id,
      userid,
    },
  });
}
