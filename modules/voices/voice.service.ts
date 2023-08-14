import prisma from '@/utils/prisma';
import { getRandomVoiceInput } from './voice.schema';

export async function getRandomVoice(input: getRandomVoiceInput) {
  const voiceCount = await prisma.voices.count({
    where: {
      gender: input.gender,
    },
  });
  const voice = await prisma.voices.findMany({
    skip: Math.floor(Math.random() * voiceCount),
    take: 1,
    where: {
      gender: input.gender,
    },
  });
  return voice[0];
}
