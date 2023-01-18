import prisma from '@/utils/prisma';
import { Template, createTemplateInput } from './template.schema';

export async function createTemplate(userid: number, input: createTemplateInput) {
  const { object } = input;

  return await prisma.templates.create({
    data: {
      userid,
      object,
      game: '5e',
    }
  });
}

export async function getTemplate(userid: number, id: number) {
  return await prisma.templates.findMany({
    select: {
      object: true,
    },
    where: {
      id,
      OR: [
        {
          userid: 0,
        },
        {
          userid,
        },
      ]
    }
  });
}

export async function getTemplateList(userid: number) {
  const templates = await prisma.templates.findMany({
    select: {
      id: true,
      userid: true,
      object: true,
    },
    where: {
      OR: [
        {
          userid: 0,
        },
        {
          userid,
        },
      ]
    },
    orderBy: [
      {
        userid: 'asc',
      },
      {
        id: 'asc',
      }
    ]
  });

  return templates.map( item => {
    return {
      id: item.id,
      userid: item.userid,
      name: (item.object as Template).name,
    };
  });
}

export async function updateTemplate(userid: number, id: number, input: createTemplateInput) {
  const { object } = input;

  return await prisma.templates.updateMany({
    where: {
      id,
      userid,
    },
    data: {
      object,
    }
  });
}

export async function deleteTemplate(userid: number, id: number) {
  return await prisma.templates.deleteMany({
    where: {
      id,
      userid,
    }
  });
}
