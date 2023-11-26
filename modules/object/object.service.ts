import { z } from 'zod';
import prisma from '@/utils/prisma';
import { ChoiceRandomObject, Choice } from '@/types';
import { AnyObject } from '@/schemas';

export async function getChoiceObject(
  userId: number,
  choice: ChoiceRandomObject['choice']
) {
  if (!choice?.objectType) {
    return null;
  }

  const fields = choice?.resultType === 'nameId' ? 'id, name' : 'object';

  const parameters: Array<any> = [choice.objectType, userId || 0];

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

  choice?.filters?.forEach((filter) => {
    parameters.push(filter.keyName);
    additionalFilters += ` AND object -> $${parameters.length} ?& ARRAY[`;
    filter.keyValues.forEach((value, index) => {
      parameters.push(value);
      if (index > 0) {
        additionalFilters += ',';
      }
      additionalFilters += `$${parameters.length}`;
    });
    additionalFilters += '] ';
  });

  parameters.push(choice?.number || 1);

  type ResultNameId = {
    id: number;
    name: string;
  };

  type ResultObject = {
    object: AnyObject;
  };

  const result = await prisma.$queryRawUnsafe(
    `
    SELECT ${fields}
    FROM objects
    WHERE type = $1
      AND userid IN (0, $2)
      ${additionalFilters}
    ORDER BY RANDOM() LIMIT $${parameters.length};
  `,
    ...parameters
  );

  if (choice?.resultType === 'nameId') {
    const fullResult: Choice[] = (result as ResultNameId[])?.map((value) => {
      return {
        id: value.id,
        value: value.name,
      };
    });
    return fullResult.concat(choice.chosenAlready || []);
  } else if (choice?.resultType === 'object') {
    if ((result as ResultObject[])?.length === 0) {
      return null;
    }
    return (result as ResultObject[])[0]?.object;
  }
  return result as AnyObject;
}
