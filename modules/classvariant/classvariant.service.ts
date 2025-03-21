import prisma from '@/utils/prisma';
import {
  Classvariant,
  PostClassvariantBody,
  PutClassvariantBody,
} from './classvariant.schema';

export async function createClassvariant(
  userid: number,
  input: PostClassvariantBody
) {
  const { object, classId, game } = input;

  // check if class exists and belongs to user
  // TODO: it wold be awesome if users could create class variants for other users' classes
  const classResult = await prisma.objects.findFirst({
    select: {
      id: true,
    },
    where: {
      id: classId,
      userid,
      type: 3,
    },
  });

  if (!classResult) {
    throw new Error('Class not found');
  }

  return await prisma.objects.create({
    data: {
      game,
      userid,
      type: 10003,
      name: object.name,
      variantof: classId,
      object,
    },
  });
}

export async function getClassvariant(userid: number, id: number) {
  const array = await prisma.objects.findMany({
    select: {
      object: true,
      id: true,
      description: true,
    },
    where: {
      id,
      type: 10003,
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
    object: result.object as Classvariant,
    id: result.id,
  };
  response.object.id = result.id;
  response.object.description = result.description || '';
  return response;
}

export async function getRandomClassvariant(userid: number, variantof: number) {
  const variantCount = await prisma.objects.count({
    where: {
      type: 10003,
      variantof,
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
  if (variantCount === 0) {
    return null;
  }
  const array = await prisma.objects.findMany({
    skip: Math.floor(Math.random() * variantCount),
    take: 1,
    select: {
      object: true,
      id: true,
    },
    where: {
      type: 10003,
      variantof,
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
    object: result.object as Classvariant,
    id: result.id,
  };
  response.object.id = result.id;
  return response;
}

export async function getClassvariantList(userid: number) {
  return await prisma.objects.findMany({
    select: {
      id: true,
      userid: true,
      name: true,
      objects: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    where: {
      type: 10003,
      NOT: {
        variantof: null,
      },
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

export async function getClassvariantClassList(
  userid: number,
  variantof: number
) {
  return await prisma.objects.findMany({
    select: {
      id: true,
      userid: true,
      name: true,
    },
    where: {
      variantof,
      type: 10003,
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

export async function updateClassvariant(
  userid: number,
  id: number,
  input: PutClassvariantBody
) {
  const { object } = input;

  return await prisma.objects.updateMany({
    where: {
      id,
      userid,
      type: 10003,
    },
    data: {
      object,
      name: object.name,
    },
  });
}

export async function deleteClassvariant(userid: number, id: number) {
  return await prisma.objects.deleteMany({
    where: {
      id,
      userid,
      type: 10003,
    },
  });
}
