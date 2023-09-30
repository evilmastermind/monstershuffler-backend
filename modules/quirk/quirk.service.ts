import prisma from '@/utils/prisma';

export async function getRandomQuirk() {
  const quirkCount = await prisma.quirks.count();
  const array = await prisma.quirks.findMany({
    skip: Math.floor(Math.random() * quirkCount),
    take: 1,
  });
  if (array.length === 0) {
    return null;
  }
  const result = array[0];
  return result;
}
