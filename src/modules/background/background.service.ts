import prisma from '@/utils/prisma';

export async function getRandomBackground() {
  const backgroundCount = await prisma.backgrounds.count();
  const background = await prisma.backgrounds.findMany({
    skip: Math.floor(Math.random() * backgroundCount),
    take: 1,
  });

  return background[0];
}