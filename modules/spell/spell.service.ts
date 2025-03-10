import prisma from '@/utils/prisma';
import {
  PostSpellBody,
  GetSpellListBody,
  PutSpellBody,
} from './spell.schema';
import { Spell } from 'monstershuffler-shared';

// TODO: spells will be stored with their id and name inside objects
// this means that if the spell's name changes, it will have to be updated in every object that uses it
// I need to create an "update spell names" button in the editor, and maybe retrieve the new spell names from the database
// when an object is loaded... and maybe allow users to use shared spells only if they copy them into their own folders

export async function createSpell(userid: number, input: PostSpellBody) {
  const { object, game, name } = input;

  const newObject = await prisma.objects.create({
    data: {
      game,
      type: 102,
      userid,
      name,
      object,
    },
  });

  return newObject;
}

export async function getSpellList(userid: number, filters: GetSpellListBody) {
  const {
    game,
    name,
    level,
    range,
    ritual,
    school,
    source,
    className,
    duration,
    component,
    castingTime,
    description,
  } = filters;

  const spellList = await prisma.objects.findMany({
    select: {
      id: true,
      userid: true,
      name: true,
    },
    where: {
      game,
      type: 102,
      AND: [
        {
          OR: [
            {
              userid: 0,
            },
            {
              userid,
            },
          ],
        },
        {
          OR: [
            {
              object: {
                path: ['name'],
                string_contains: name,
              },
            },
            {
              object: {
                path: ['level'],
                equals: level,
              },
            },
            {
              object: {
                path: ['range'],
                string_contains: range,
              },
            },
            {
              object: {
                path: ['ritual'],
                equals: ritual,
              },
            },
            {
              object: {
                path: ['school'],
                equals: school,
              },
            },
            {
              object: {
                path: ['source'],
                string_contains: source,
              },
            },
            {
              object: {
                path: ['classes'],
                array_contains: className,
              },
            },
            {
              object: {
                path: ['duration'],
                string_contains: duration,
              },
            },
            {
              object: {
                path: ['components'],
                string_contains: component,
              },
            },
            {
              object: {
                path: ['castingTime'],
                string_contains: castingTime,
              },
            },
            {
              object: {
                path: ['description'],
                string_contains: description,
              },
            },
          ],
        },
      ],
    },
  });

  return spellList;
}

export async function getSpell(userid: number, nameOrId: string) {
  // if nameOrId is a number, it's an id, otherwise it's a name
  // (Prisma ignores unefined fields)
  const name = isNaN(parseInt(nameOrId)) ? nameOrId : undefined;
  const id = isNaN(parseInt(nameOrId)) ? undefined : parseInt(nameOrId);
  const array = await prisma.objects.findMany({
    select: {
      id: true,
      userid: true,
      object: true,
    },
    where: {
      id,
      name: {
        contains: name,
        mode: 'insensitive',
      },
      userid,
      type: 102,
    },
  });
  if (array.length) {
    // add id inside object for each action
    const object = array[0].object as Spell;
    if (object) {
      object.id = array[0].id;
    }
    return array[0];
  }
  return null;
}

export async function updateSpell(
  userid: number,
  id: number,
  input: PutSpellBody
) {
  const { name, object } = input;

  return await prisma.objects.updateMany({
    where: {
      id,
      userid,
      type: 102,
    },
    data: {
      name,
      object,
    },
  });
}

export async function deleteSpell(userid: number, id: number) {
  return await prisma.objects.deleteMany({
    where: {
      id,
      userid,
      type: 102,
    },
  });
}
