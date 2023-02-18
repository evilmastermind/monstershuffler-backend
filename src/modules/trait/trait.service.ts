import prisma from '@/utils/prisma';

export async function getRandomTrait() {
  const traitCount = await prisma.traits.count();
  const trait = await prisma.traits.findMany({
    skip: Math.floor(Math.random() * traitCount),
    take: 1,
  });

  return trait[0];
}

export async function getTraitDescription(name: string) {
  return await prisma.traits.findUnique({
    select: {
      description: true,
    },
    where: {
      name,
    },
  });
}
