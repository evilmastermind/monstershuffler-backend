import { z } from 'zod';
import prisma from "@/utils/prisma";
import { AnyObject, ChoiceRandomObject, Choice } from '@/modules/schemas';

export async function getChoiceObject(userId: number, choice: ChoiceRandomObject['choice']) {

  if (!choice?.objectType) {
    return null;
  }

  const fields = choice?.resultType === 'nameId' ? 'id, name' : 'object';

  const parameters: Array<any> = [choice.objectType, userId || 0];

  const chosenAlreadyIds = choice.chosenAlready?.filter((value) => value?.id).map((value) => value?.id) || [];

  let additionalFilters = '';

  if (chosenAlreadyIds.length > 0) {
    additionalFilters += ` AND id NOT IN (`;
    chosenAlreadyIds.forEach((id, index) => {
      if (index > 0) {
        additionalFilters += `,`;
      }
      parameters.push(id);
      additionalFilters += `?`;
    });
    additionalFilters += `) `;
  }

  choice?.filters?.forEach((filter) => {
    if (filter.keyValues.length > 1) {
      parameters.push(JSON.stringify(filter.keyValues), `$."${filter.keyName}"`);
      additionalFilters += ` AND JSON_CONTAINS(object, ?, ?) `
    } else {
      parameters.push(`${JSON.stringify(filter.keyValues[0])}`, `$."${filter.keyName}"`);
      additionalFilters +=  ` AND JSON_CONTAINS(object, ?, ?) `
    }
  });

  parameters.push(choice?.number || 1);

  type ResultNameId = {
    id: number;
    name: string;
  };

  type ResultObject = {
    object: AnyObject;
  };

  const result = await prisma.$queryRawUnsafe(`
    SELECT ${fields}
    FROM objects
    WHERE type = ?
      AND userid IN (0, ?)
      ${additionalFilters}
    ORDER BY RAND() LIMIT ?;
  `, ...parameters);

  // console.log("result:", result);

  if (choice?.resultType === 'nameId') {
    const fullResult: Choice[] = (result as ResultNameId[])?.map((value) => {
      return {
        id: value.id,
        value: value.name,
      };
    });
    return fullResult.concat(choice.chosenAlready || []);
  } else if (choice?.resultType === 'object') {
    return (result as ResultObject[])[0]?.object;
  }

  return result as AnyObject ;
}
