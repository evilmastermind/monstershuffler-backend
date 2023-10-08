import prisma from '@/utils/prisma';

export async function getRandomCharacterhook() {
  const characterhookCount = await prisma.characterhooks.count();
  const array = await prisma.characterhooks.findMany({
    skip: Math.floor(Math.random() * characterhookCount),
    take: 1,
  });
  if (array.length === 0) {
    return null;
  }
  return array[0];
}

export async function getRandomCharacterhookForAge(age: string) {
  const filter = {
    object: {
      path: ['compatibleAges'],
      array_contains: [age],
    },
  };
  const characterhookCount = await prisma.characterhooks.count({
    where: filter,
  });
  const array = await prisma.characterhooks.findMany({
    skip: Math.floor(Math.random() * characterhookCount),
    take: 1,
    where: filter,
  });
  if (array.length === 0) {
    return null;
  }
  return array[0];
}
