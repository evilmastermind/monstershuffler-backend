import prisma from '@/utils/prisma';
import { getRandomTraitInput } from './trait.schema';

export async function getRandomTrait(input: getRandomTraitInput) {
  const traitCount = await prisma.traits.count();
  const trait = await prisma.traits.findMany({
    skip: Math.floor(Math.random() * traitCount),
    take: 1,
    where: {
      type: input.type,
      subtitle: input.subtitle,
      category: input.category,
      feeling: input.feeling,
    },
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
