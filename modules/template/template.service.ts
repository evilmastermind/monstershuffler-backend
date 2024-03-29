import prisma from '@/utils/prisma';
import { Template, createTemplateInput } from './template.schema';

export async function createTemplate(
  userid: number,
  input: createTemplateInput
) {
  const { object, game } = input;

  return await prisma.objects.create({
    data: {
      userid,
      type: 4,
      game,
      name: object.name,
      object,
    },
  });
}

export async function getTemplate(userid: number, id: number) {
  return await prisma.objects.findMany({
    select: {
      object: true,
    },
    where: {
      id,
      type: 4,
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
}

export async function getTemplateList(userid: number) {
  return await prisma.objects.findMany({
    select: {
      id: true,
      userid: true,
      name: true,
    },
    where: {
      type: 4,
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

export async function updateTemplate(
  userid: number,
  id: number,
  input: createTemplateInput
) {
  const { object, game } = input;

  return await prisma.objects.updateMany({
    where: {
      id,
      userid,
      type: 4,
    },
    data: {
      object,
      game,
      name: object.name,
    },
  });
}

export async function deleteTemplate(userid: number, id: number) {
  return await prisma.objects.deleteMany({
    where: {
      id,
      userid,
      type: 4,
    },
  });
}
