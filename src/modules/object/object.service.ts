import { chosenAlready } from './../schemas';
import { z } from 'zod';
import prisma from "@/utils/prisma";
import { choiceRandomObject } from "@/modules/schemas";
import { Prisma } from '@prisma/client';
import { RawValue } from '@prisma/client/runtime';


type Random = z.infer<typeof choiceRandomObject>;

export async function getRandomObject(userid: number, choice: Random['choice']) {

  if (!choice?.objectType) {
    return null;
  }
  const fields = choice?.resultType === 'nameId' ? 'id, name' : 'object';

  const chosenAlreadyIds = choice.chosenAlready?.filter((value) => value?.id).map((value) => value?.id) || [];

  let additionalFilters = '';

  if (chosenAlreadyIds.length > 0) {
    additionalFilters += ` AND id NOT IN (${chosenAlreadyIds}) `;
  }

  choice?.filters?.forEach((filter) => {
    filter.keyValues.forEach((value) => {
      additionalFilters += ` AND '${value}' = ANY (ARRAY[object -> '${filter.keyName}']::text[])`;
    });
  });

  const result = await prisma.$queryRawUnsafe(`
    SELECT ${fields}
    FROM objects
    WHERE type = ${choice.objectType}
      AND userid IN (0, ${userid})
      ${additionalFilters}
    ORDER BY random() LIMIT ${choice?.number || 1};
  `);

  // TODO: this works but it is super vulnerable to SQL injection
  // I'm starting to freaking hate Prisma, but luckily they have a 
  // feature to use queryRawUnsafe with parametrization
  // https://www.prisma.io/docs/concepts/components/prisma-client/raw-database-access

  return result ;
}
