import prisma from '@/utils/prisma';
import { isAdmin } from '@/modules/user/user.service';
import { objects } from '@prisma/client';
import type { Choice } from '@/types';

export async function countObjects() {
  const objectCount = await prisma.objects.count();
  return objectCount;
}

export async function getFirstObjectId() {
  const firstObject = await prisma.objects.findFirst({
    select: {
      id: true,
    },
    orderBy: {
      id: 'asc',
    },
  });

  return firstObject?.id;
}

export async function getObjectsWithPagination(
  userid: number,
  cursor: number | undefined,
  pageSize: number
) {
  if (!(await isAdmin(userid))) {
    return [];
  }

  return await prisma.objects.findMany({
    skip: 1,
    take: pageSize,
    cursor: {
      id: cursor,
    },
  });
}

export async function saveObject(object: objects) {
  await prisma.objects.update({
    where: {
      id: object.id,
    },
    data: {
      object: object.object !== null ? object.object : Prisma.JsonNull,
    },
  });
}

export async function getSpellDataFromName(name: string) {
  const spell = await prisma.objects.findFirst({
    where: {
      name: name,
      type: 102,
      userid: 0,
    },
    select: {
      id: true,
      object: true,
    },
  });

  return spell;
}

export async function getActionDetails(actionId: number) {
  const details = await prisma.actionsdetails.findFirst({
    where: {
      objectid: actionId,
    },
  });

  const tags = await prisma.actionstags.findMany({
    select: {
      tag: true,
    },
    where: {
      objectid: actionId,
    },
  });

  if (details) {
    // @ts-ignore
    details.tags = tags.map((tag) => tag.tag);
  }
  return details;
}

///////////////////////////////////
// O B J E C T   T Y P E S
///////////////////////////////////
//
//  type  |     name
// -------+------------------------
//      1 | character
//      2 | race
//      3 | class
//      4 | template
//      5 | background
//    101 | action
//    102 | spell
//   1001 | weapon
//   1002 | armor
//  10002 | racevariant
//  10003 | classvariant
//
///////////////////////////////////

// ["actions","armor","backgrounds","bases","damagetypes","languages","names","characterhooks","skills","spells","traits","voices","weapons"]
export async function getIdsFromNames(chosenAlready: string[], source: string) {
  let table = 'objects';
  let objectType = 0;
  switch (source) {
  case 'actions':
    objectType = 101;
    break;
  case 'armor':
    objectType = 1002;
    break;
  case 'languages':
    table = 'languages';
    break;
  case 'skills':
    table = 'skills';
    break;
  case 'weapons':
    objectType = 1001;
    break;
  case 'spells':
    objectType = 102;
    break;
  case 'objects':
    break;
  default:
    console.warn('UNDEFINED TYPE DETECTED: ' + source);
    table = 'somethingwrongtomakethisfail';
    break;
  }

  const newChosenAlready: Choice[] = [];
  for (const name of chosenAlready) {
    if (table === 'objects') {
      const ids = await prisma.objects.findMany({
        select: {
          id: true,
          object: true,
        },
        where: {
          name: {
            equals: name.trim(),
            mode: 'insensitive', // -- for PostgreSQL only
          },
          type: objectType,
          userid: 0,
        },
      });
      if (ids.length > 0) {
        if (source === 'spells') {
          const object = ids[0].object as { level: string };
          newChosenAlready.push({ id: ids[0].id, value: name, properties: {
            level: parseInt(object.level ?? '1'),
          } });
        } else {
          newChosenAlready.push({ id: ids[0].id, value: name });
        }
      } else {
        newChosenAlready.push({ value: name });
      }
    } else {
      const ids = await prisma.$queryRawUnsafe<{ id: number }[]>(
        `SELECT id FROM ${table} WHERE LOWER(name) = LOWER('${name.trim()}')`
      );
      if (ids.length > 0) {
        newChosenAlready.push({ id: ids[0].id, value: name });
      } else {
        newChosenAlready.push({ value: name });
      }
    }
  }
  return newChosenAlready;
}

// function fixPronouns(text: string, pronouns: string) {
//   let result = text;
//   if (pronouns === "male") {
//     result = result.replaceAll("§", "he");
//     result = result.replaceAll("@", "his");
//     result = result.replaceAll("#", "him");
//   } else if (pronouns === "female") {
//     result = result.replaceAll("§", "she");
//     result = result.replaceAll("@", "her");
//     result = result.replaceAll("#", "her");
//   } else if (pronouns === "neutral") {
//     result = result.replaceAll("§", "they");
//     result = result.replaceAll("@", "their");
//     result = result.replaceAll("#", "them");
//   } else {
//     result = result.replaceAll("§", "it");
//     result = result.replaceAll("@", "its");
//     result = result.replaceAll("#", "it");
//   }
//   return result;
// }

export async function convertBackgroundPronouns() {
  const characterHooks = await prisma.characterhooks.findMany();
  for (let i = 0; i < characterHooks.length; i++) {
    const characterHook = characterHooks[i];
    if (characterHook.hook) {
      characterHook.hook = characterHook.hook.replaceAll('§', '[they]');
      characterHook.hook = characterHook.hook.replaceAll('@', '[their]');
      characterHook.hook = characterHook.hook.replaceAll('#', '[them]');
      await prisma.characterhooks.update({
        where: {
          id: characterHook.id,
        },
        data: {
          hook: characterHook.hook,
        },
      });
    }
  }
}
