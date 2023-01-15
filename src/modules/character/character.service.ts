import prisma from '@/utils/prisma';
import { createCharacterInput } from './character.schema';

export async function createCharacter(userid: number, input: createCharacterInput) {
  const { object } = input;

  return await prisma.characters.create({
    data: {
      userid,
      object,
      game: '5e',
    }
  });
}

export async function getCharacter(userid: number, id: number) {
  return await prisma.characters.findMany({
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

export async function getCharacterList(userid: number) {
  const characters = await prisma.characters.findMany({
    select: {
      id: true,
      userid: true,
      object: true,
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

  return characters.map( item => {
    return {
      id: item.id,
      userid: item.userid,
      name: item.object?.name || 'Character Name',
    };
  });
}

export async function updateCharacter(userid: number, id: number, input: createCharacterInput) {
  const { object } = input;

  return await prisma.characters.updateMany({
    where: {
      id,
      userid,
    },
    data: {
      object,
    }
  });
}

export async function deleteCharacter(userid: number, id: number) {
  return await prisma.characters.deleteMany({
    where: {
      id,
      userid,
    }
  });
}
