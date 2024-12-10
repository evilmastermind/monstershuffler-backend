import prisma from '@/utils/prisma';
import { ChoiceRandomObject, Choice } from '@/types';

export async function getSkillList() {
  return await prisma.skills.findMany({
    orderBy: [
      {
        name: 'asc',
      },
    ],
  });
}

export async function getRandomSkill() {
  const skillCount = await prisma.skills.count();
  const array = await prisma.skills.findMany({
    skip: Math.floor(Math.random() * skillCount),
    take: 1,
  });
  if (array.length === 0) {
    return null;
  }
  return array[0];
}

export async function getChoiceSkill(
  userId: number,
  choice: ChoiceRandomObject['choice']
) {
  const parameters: Array<any> = [userId || 0];
  const chosenAlreadyIds =
    choice.chosenAlready
      ?.filter((value) => value?.id)
      .map((value) => value?.id) || [];

  let additionalFilters = '';

  if (chosenAlreadyIds.length > 0) {
    additionalFilters += ' AND id NOT IN (';
    chosenAlreadyIds.forEach((id, index) => {
      if (index > 0) {
        additionalFilters += ',';
      }
      parameters.push(id);
      additionalFilters += `$${parameters.length}`;
    });
    additionalFilters += ') ';
  }

  parameters.push(choice?.number || 1);

  type ResultNameId = {
    id: number;
    name: string;
  };

  const result = await prisma.$queryRawUnsafe(
    `
    SELECT id, name
    FROM skills
    WHERE userid IN (0, $1)
      ${additionalFilters}
    ORDER BY RANDOM() LIMIT $${parameters.length};
  `,
    ...parameters
  );

  const fullResult: Choice[] = (result as ResultNameId[])?.map((value) => {
    return {
      id: value.id,
      value: value.name,
    };
  });
  return fullResult.concat(choice.chosenAlready || []);
}
