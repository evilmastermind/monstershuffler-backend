import prisma from '@/utils/prisma';
import { createLanguageInput } from './language.schema';

export async function createLanguage(userid: number, input: createLanguageInput) {
  const { name, script } = input;

  return await prisma.languages.create({
    data: {
      userid,
      name,
      script
    }
  });
}

export async function getLanguageList(userid: number) {
  return await prisma.languages.findMany({
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
}

export async function updateLanguage(userid: number, id: number, input: createLanguageInput) {
  const { name, script } = input;

  return await prisma.languages.updateMany({
    where: {
      id,
      userid,
    },
    data: {
      name,
      script
    }
  });
}

export async function deleteLanguage(userid: number, id: number) {
  return await prisma.languages.deleteMany({
    where: {
      id,
      userid,
    }
  });
}
