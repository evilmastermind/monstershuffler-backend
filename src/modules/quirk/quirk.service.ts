import prisma from "@/utils/prisma";

export async function getRandomQuirk() {
  const quirkCount = await prisma.quirks.count();
  const quirk = await prisma.quirks.findMany({
    skip: Math.floor(Math.random() * quirkCount),
    take: 1,
  });

  return quirk[0];
}
