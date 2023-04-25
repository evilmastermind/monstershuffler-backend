import prisma from '@/utils/prisma';

export async function getSkillList() {
  return await prisma.skills.findMany({
    orderBy: [
      {
        name: 'asc',
      }
    ]
  });
}

export async function getRandomSkill() {
  const skillCount = await prisma.skills.count();
  const skill = await prisma.skills.findMany({
    skip: Math.floor(Math.random() * skillCount),
    take: 1,
  });
  return skill[0];
}
