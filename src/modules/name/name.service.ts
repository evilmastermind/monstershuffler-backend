import prisma from '@/utils/prisma';
import { getRandomNameInput } from './name.schema';

export async function getRandomName(input: getRandomNameInput) {
  const nameCount = await prisma.names.count();
  const name = await prisma.names.findMany({
    skip: Math.floor(Math.random() * nameCount),
    take: 1,
    where: {
      race: input.race,
      gender: input.gender,
    },
  });

  return name[0].name;
}
