import prisma from '@/utils/prisma';
import { actionsdetails, Prisma } from '@prisma/client';
import { isAdmin } from '@/modules/user/user.service';
import { objects } from '@prisma/client';
import { type Choice } from '@/modules/schemas';

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

  if(!(await isAdmin(userid))) {
    return [];
  }

  return await prisma.objects.findMany({
    skip: 1,
    take: pageSize,
    cursor: {
      id: cursor,
    }
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

export async function getSpellIdFromName(name: string) {
  const spell = await prisma.objects.findFirst({
    where: {
      name: name,
      type: 102,
      userid: 0,
    },
    select: {
      id: true,
    },
  });

  return spell?.id;
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
    details.tags = tags.map(tag => tag.tag);
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
//      5 | profession
//    101 | action
//    102 | spell
//   1001 | weapon
//   1002 | armor
//  10002 | racevariant
//  10003 | classvariant
//
///////////////////////////////////

// ["actions","armor","backgrounds","bases","damagetypes","languages","names","professions","skills","spells","traits","voices","weapons"]
export async function getIdsFromNames(chosenAlready: string[], type: string, objectType) {
  
  let table = 'objects';
  switch (type) {
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
    console.log('UNDEFINED TYPE DETECTED: ' + type);
    table = 'somethingwrongtomakethisfail';
    break;
  }


  
  const newChosenAlready: Choice[] = [];
  for(const name of chosenAlready) {
    if(table === 'objects') {
      const ids = await prisma.objects.findMany({
        select: {
          id: true,
        },
        where: {
          name: {
            equals: name.trim(),
            mode: 'insensitive',
          },
          type: objectType,
          userid: 0,
        }
      });
      // console.log('ids:' + ids);
      if(ids.length > 0) {
        newChosenAlready.push({ id: ids[0].id, name: name});
      } else {
        newChosenAlready.push({ name: name});
      }
    } else {
      const ids = await prisma.$queryRawUnsafe(`SELECT id FROM monstershuffler.${table} WHERE LOWER(name) = LOWER('${name.trim()}')`);
      if(ids.length > 0) {
        newChosenAlready.push({ id: ids[0].id, name: name});
      } else {
        newChosenAlready.push({ name: name});
      }
    }
  }
  return newChosenAlready;
}
