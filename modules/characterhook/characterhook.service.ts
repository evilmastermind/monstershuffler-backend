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
