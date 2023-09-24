import prisma from '@/utils/prisma';
import { createBackgroundInput, Background } from './background.schema';

export async function createBackground(
  userid: number,
  input: createBackgroundInput
) {
  const { object, description, age, game } = input;

  const response = await prisma.objects.create({
    data: {
      userid,
      object,
      type: 5,
      name: object.name,
      game,
    },
  });
  await prisma.backgroundsdetails.create({
    data: {
      objectid: response.id,
      name: object.name,
      femalename: object.femaleName,
      description,
      age,
    },
  });
  return response;
}

export async function getBackground(userid: number, id: number) {
  const result = (await prisma.objects.findMany({
    select: {
      object: true,
      id: true,
    },
    where: {
      id,
      type: 5,
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
  const details = await getBackgroundDetails(id);
  const response = {
    object: result.object as Background,
    id: result.id,
    name: details.name,
    femaleName: details.femalename,
    age: details.age,
    description: details.description || '',
  };
  response.object.id = result.id;
  return response;
}

export async function getBackgroundDetails(id: number) {
  const result = (await prisma.backgroundsdetails.findMany({
    where: {
      objectid: id,
    },
  }))[0];
  return result;
}

export async function getRandomBackground(userid: number) {
  const backgroundCount = await prisma.objects.count({
    where: {
      type: 5,
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
    skip: Math.floor(Math.random() * backgroundCount),
    take: 1,
    select: {
      object: true,
      id: true,
    },
    where: {
      type: 5,
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
    object: result.object as Background,
    id: result.id,
  };
  response.object.id = result.id;
  return response;
}

export async function getBackgroundList(userid: number) {
  const result = prisma.objects.findMany({
    select: {
      id: true,
      userid: true,
      name: true,
    },
    where: {
      type: 5,
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
export async function updateBackground(
  userid: number,
  id: number,
  input: createBackgroundInput
) {
  const { object, description, age, game } = input;

  const response = await prisma.objects.updateMany({
    where: {
      id,
      userid,
      type: 5,
    },
    data: {
      object,
      game,
      name: object.name,
    },
  });

  await prisma.backgroundsdetails.updateMany({
    where: {
      objectid: id,
    },
    data: {
      name: object.name,
      femalename: object.femaleName,
      description,
      age,
    },
  });

  return response;
}

export async function deleteBackground(userid: number, id: number) {
  return await prisma.objects.deleteMany({
    where: {
      id,
      userid,
      type: 5,
    },
  });
}
