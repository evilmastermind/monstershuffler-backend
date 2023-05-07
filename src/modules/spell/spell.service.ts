import prisma from '@/utils/prisma';
import { createSpellInput, getSpellListInput, updateSpellInput } from './spell.schema';

// TODO: spells will be stored with their id and name inside objects
// this means that if the spell's name changes, it will have to be updated in every object that uses it
// I need to create an "update spell names" button in the editor, and maybe retrieve the new spell names from the database
// when an object is loaded... and maybe allow users to use shared spells only if they copy them into their own folders

export async function createSpell(userid: number, input: createSpellInput) {
  const { object, game, name }  = input;

  const newObject = await prisma.objects.create({
    data: {
      game,
      type: 102,
      userid,
      name,
      object,
    }
  });

  return newObject;
}

export async function getSpellList(userid: number, filters: getSpellListInput) {
  const { game, name, level, range, ritual, school, source, className, duration, component, castingTime, description } = filters;
  
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
              }
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
        }
      ]
    },
  });

  return spellList;
}

export async function getSpell(userid: number, id: number) {
  const spell = await prisma.objects.findMany({
    select: {
      id: true,
      userid: true,
      object: true,
    },
    where: {
      id,
      userid,
      type: 102,
    },
  });

  return spell;
}

export async function updateSpell(userid: number, id: number, input: updateSpellInput) {
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
