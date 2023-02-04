import prisma from '@/utils/prisma';
import { createProfessionInput, Profession } from './profession.schema';

export async function createProfession(userid: number, input: createProfessionInput) {
  const { object, description, age } = input;

  return await prisma.professions.create({
    data: {
      userid,
      object,
      name: object.name,
      description,
      age,
      game: '5e',
    }
  });
}

export async function getProfession(userid: number, id: number) {
  return await prisma.professions.findMany({
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

export async function getProfessionList(userid: number) {
  const professions = await prisma.professions.findMany({
    select: {
      id: true,
      userid: true,
      name: true,
      description: true,
      age: true,
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
  return professions;
}

export async function updateProfession(userid: number, id: number, input: createProfessionInput) {
  const { object, description, age } = input;

  return await prisma.professions.updateMany({
    where: {
      id,
      userid,
    },
    data: {
      object,
      name: object.name,
      description,
      age,
    }
  });
}

export async function deleteProfession(userid: number, id: number) {
  return await prisma.professions.deleteMany({
    where: {
      id,
      userid,
    }
  });
}
