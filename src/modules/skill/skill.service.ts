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
