import prisma from '@/utils/prisma';
import { createCharacterInput, updateCharacterInput, Character } from './character.schema';

export async function createCharacter(
  userid: number,
  input: createCharacterInput
) {
  const { object, game, name } = input;

  const character = await prisma.objects.create({
    data: {
      game,
      type: 1,
      userid,
      name,
      object,
    },
  });

  // TODO: define characters' stats object
  await prisma.charactersdetails.create({
    data: {
      objectid: character.id,
      name,
      monstertype: character.stats.type.value,
      cr: character.stats.cr.value,
      alignment: character.stats.alignment.value,
      size: character.stats.size.value,
      meta: character.stats.meta.value,
    },
  });

  return character;
}

export async function getCharacter(userid: number, id: number) {
  const result = (await prisma.objects.findMany({
    select: {
      object: true,
      id: true,
    },
    where: {
      id,
      type: 1,
      OR: [
        {
          userid: 0,
        },
        {
          userid,
        },
      ],
    },
  }))[0];
  const response = {
    object: result.object as Character,
    id: result.id,
  };
  response.object.id = result.id;
  return response;
}

export async function getCharacterList(userid: number) {
  return await prisma.objects.findMany({
    select: {
      id: true,
      userid: true,
      name: true,
    },
    where: {
      type: 1,
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

export async function updateCharacter(
  userid: number,
  id: number,
  input: updateCharacterInput
) {
  const { object, game, name } = input;

  const result = await prisma.objects.updateMany({
    where: {
      id,
      userid,
      type: 1,
    },
    data: {
      object,
      name,
      game,
    },
  });

  // TODO: define characters' stats object
  await prisma.charactersdetails.updateMany({
    where: {
      objectid: id,
    },
    data: {
      name,
      monstertype: object.stats.type.value,
      cr: object.stats.cr.value,
      alignment: object.stats.alignment.value,
      size: object.stats.size.value,
      meta: object.stats.meta.value,
    },
  });

  return result;
}

export async function deleteCharacter(userid: number, id: number) {
  return await prisma.objects.deleteMany({
    where: {
      id,
      userid,
      type: 1,
    },
  });
}
