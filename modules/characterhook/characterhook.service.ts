import prisma from "@/utils/prisma";

export async function getRandomCharacterhook() {
  const characterhookCount = await prisma.characterhooks.count();
  const characterhook = await prisma.characterhooks.findMany({
    skip: Math.floor(Math.random() * characterhookCount),
    take: 1,
  });

  return characterhook[0];
}
