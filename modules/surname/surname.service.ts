import prisma from '@/utils/prisma';
import { getRandomSurnameInput } from './surname.schema';

export async function getRandomSurname(input: getRandomSurnameInput) {
  const surnameCount = await prisma.surnames.count({
    where: {
      race: input.race,
      gender: input.gender,
    },
  });
  const array = await prisma.surnames.findMany({
    skip: Math.floor(Math.random() * surnameCount),
    take: 1,
    where: {
      race: input.race,
      gender: input.gender,
    },
  });
  if (array.length === 0) {
    return null;
  }
  return array[0].surname;
}
