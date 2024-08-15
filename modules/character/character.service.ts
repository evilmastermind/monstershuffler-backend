import prisma from '@/utils/prisma';
import { PostCharacterBody, PutCharacterBody } from './character.schema';
import { Character } from 'monstershuffler-shared';

export async function createCharacter(
  userid: number,
  input: PostCharacterBody
) {
  const { object, game } = input;

  const name = getCharacterName(object);

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
      monstertype: object?.statistics?.type?.number || 0,
      cr: object?.statistics?.CR?.number || 0,
      alignment: object?.statistics?.alignment?.number || 0,
      size: object?.statistics?.size?.number || 0,
      meta: object?.statistics?.meta?.string || '',
    },
  });

  return character;
}

export async function getCharacter(userid: number, id: number) {
  const array = await prisma.objects.findMany({
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
  });
  if (array.length === 0) {
    return null;
  }
  const result = array[0];
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
  input: PutCharacterBody
) {
  const { object, game } = input;

  const name = getCharacterName(object);

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
      monstertype: object?.statistics?.type?.number || 0,
      cr: object?.statistics?.CR?.number || 0,
      alignment: object?.statistics?.alignment?.number || 0,
      size: object?.statistics?.size?.number || 0,
      meta: object?.statistics?.meta?.string || '',
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


function getCharacterName(object: Character) {
  const c = object.character;
  return `${c?.prename || ''} ${c.name} ${c.surname || ''}`.trim();
}
