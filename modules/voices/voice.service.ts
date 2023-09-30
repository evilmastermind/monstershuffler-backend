import prisma from '@/utils/prisma';
import { getRandomVoiceInput } from './voice.schema';

export async function getRandomVoice(input: getRandomVoiceInput) {
  const voiceCount = await prisma.voices.count({
    where: {
      gender: input.gender,
    },
  });
  const array = await prisma.voices.findMany({
    skip: Math.floor(Math.random() * voiceCount),
    take: 1,
    where: {
      gender: input.gender,
    },
  });
  if (array.length === 0) {
    return null;
  }
  const result = array[0];
  return result;
}
