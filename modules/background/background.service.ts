import prisma from '@/utils/prisma';
import { CreateBackgroundInput, Background } from './background.schema';

export async function createBackground(
  userid: number,
  input: CreateBackgroundInput
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
  const backgrounds = (await prisma.objects.findMany({
    select: {
      object: true,
      id: true,
      description: true,
      backgroundsdetails: true
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
  );
  if (backgrounds.length === 0) {
    return null;
  }
  const result = backgrounds[0];
  const response = {
    object: result.object as Background,
    id: result.id,
    name: result.backgroundsdetails?.name || '',
    femaleName: result.backgroundsdetails?.femalename || '',
    age: result.backgroundsdetails?.age || '',
    description: result.backgroundsdetails?.description || '',
  };
  response.object.id = result.id;
  response.object.description = result.backgroundsdetails?.description || '';
  return response;
}

export async function getBackgroundDetails(id: number) {
  const array = await prisma.backgroundsdetails.findMany({
    where: {
      objectid: id,
    },
  });
  if (array.length === 0) {
    return null;
  }
  return array[0];
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
  const array = await prisma.objects.findMany({
    skip: Math.floor(Math.random() * backgroundCount),
    take: 1,
    select: {
      object: true,
      id: true,
      description: true,
      backgroundsdetails: {
        select: {
          description: true
        }
      }
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
  });
  if (array.length === 0) {
    return null;
  }
  const result = array[0];
  const response = {
    object: result.object as Background,
    id: result.id,
  };
  response.object.id = result.id;
  response.object.description = result.backgroundsdetails?.description || '';
  return response;
}

export async function getRandomBackgroundForAge(userid: number, age: string) {
  const filter = {
    type: 5,
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
        object: {
          path: ['compatibleAges'],
          array_contains: [age],
        },
      },
    ],
  };
  const backgroundCount = await prisma.objects.count({
    where: filter,
  });
  const array = await prisma.objects.findMany({
    skip: Math.floor(Math.random() * backgroundCount),
    take: 1,
    select: {
      object: true,
      id: true,
      description: true,
      backgroundsdetails: {
        select: {
          description: true
        }
      }
    },
    where: filter,
  });
  if (array.length === 0) {
    return null;
  }
  const result = array[0];
  const response = {
    object: result.object as Background,
    id: result.id,
  };
  response.object.id = result.id;
  response.object.description = result.backgroundsdetails?.description || '';
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
  input: CreateBackgroundInput
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
