import prisma from '@/utils/prisma';
import { createLanguageInput } from './language.schema';
import { ChoiceRandomObject, Choice } from '@/schemas/character/choices';

export async function createLanguage(
  userid: number,
  input: createLanguageInput
) {
  const { name, script } = input;

  return await prisma.languages.create({
    data: {
      userid,
      name,
      script,
    },
  });
}

export async function getLanguageList(userid: number) {
  return await prisma.languages.findMany({
    where: {
      OR: [
        {
          userid: 0,
        },
        {
          userid,
        },
      ],
    },
    orderBy: [
      {
        userid: 'asc',
      },
      {
        id: 'asc',
      },
    ],
  });
}

export async function updateLanguage(
  userid: number,
  id: number,
  input: createLanguageInput
) {
  const { name, script } = input;

  return await prisma.languages.updateMany({
    where: {
      id,
      userid,
    },
    data: {
      name,
      script,
    },
  });
}

export async function deleteLanguage(userid: number, id: number) {
  return await prisma.languages.deleteMany({
    where: {
      id,
      userid,
    },
  });
}

export async function getChoiceLanguage(
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
    FROM languages
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
