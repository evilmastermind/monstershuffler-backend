import prisma from '@/utils/prisma';
import { getRandomNameInput } from './name.schema';

export async function getRandomName(input: getRandomNameInput) {
  const nameCount = await prisma.names.count({
    where: {
      race: input.race,
      gender: input.gender,
    },
  });
  const array = await prisma.names.findMany({
    skip: Math.floor(Math.random() * nameCount),
    take: 1,
    where: {
      race: input.race,
      gender: input.gender,
    },
  });
  if (array.length === 0) {
    return null;
  }
  return array[0].name;
}
