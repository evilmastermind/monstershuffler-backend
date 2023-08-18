import prisma from '@/utils/prisma';
import { createClassInput, Class, updateClassInput } from './class.schema';

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

export async function createClass(userid: number, input: createClassInput) {
  const { object, game } = input;

  return await prisma.objects.create({
    data: {
      game,
      type: 3,
      userid,
      name: object.name,
      object,
    },
  });
}

export async function getClass(userid: number, id: number) {
  const result = (
    await prisma.objects.findMany({
      select: {
        object: true,
        id: true,
      },
      where: {
        id,
        type: 3,
        OR: [
          {
            userid: 0,
          },
          {
            userid,
          },
        ],
      },
    })
  )[0];
  const response = {
    object: result.object as Class,
    id: result.id,
  };
  response.object.id = result.id;
  return response;
}

export async function getRandomClass(userid: number) {
  const raceCount = await prisma.objects.count({
    where: {
      type: 3,
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
  const result = (await prisma.objects.findMany({
    skip: Math.floor(Math.random() * raceCount),
    take: 1,
    select: {
      object: true,
      id: true,
    },
    where: {
      type: 3,
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
    object: result.object as Class,
    id: result.id,
  };
  response.object.id = result.id;
  return response;
}

export async function getClassWithVariantsList(userid: number) {
  const result = prisma.objects.findMany({
    select: {
      id: true,
      userid: true,
      name: true,
      other_objects: {
        select: {
          id: true,
          userid: true,
          name: true,
        },
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
            name: 'asc',
          },
        ],
      },
    },
    where: {
      type: 3,
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
        name: 'asc',
      },
    ],
  });
  return result;
}

export async function getClassList(userid: number) {
  const result = prisma.objects.findMany({
    select: {
      id: true,
      userid: true,
      name: true,
    },
    where: {
      type: 3,
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
        name: 'asc',
      },
    ],
  });
  return result;
}

// TODO: I am not updating lastedited, originaluserid, etc... Find the missing columns and update all the other services
export async function updateClass(
  userid: number,
  id: number,
  input: updateClassInput
) {
  const { object, game } = input;

  return await prisma.objects.updateMany({
    where: {
      id,
      userid,
      type: 3,
    },
    data: {
      object,
      game,
      name: object.name,
    },
  });
}

export async function deleteClass(userid: number, id: number) {
  return await prisma.objects.deleteMany({
    where: {
      id,
      userid,
      type: 3,
    },
  });
}
