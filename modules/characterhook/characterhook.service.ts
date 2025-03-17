import prisma from '@/utils/prisma';
import { PostRandomCharacterhookBody, PostRandomCharacterhookResponse } from './characterhook.schema';

export async function getRandomCharacterhook(body: PostRandomCharacterhookBody) {
  const where = {
    type: body.type,
    alignment: body.alignment,
    locationorclass: body.locationorclass? body.locationorclass : null,
  };
  const characterhookCount = await prisma.backstorysentences.count({
    where,
  });
  const array = await prisma.backstorysentences.findMany({
    skip: Math.floor(Math.random() * characterhookCount),
    take: 1,
    where,
  });
  if (array.length === 0) {
    return null;
  }
  return array[0] as PostRandomCharacterhookResponse;
}

export async function getRandomActionForCharacterhook(backstorysentenceid: number) {
  const where = {
    backstorysentenceid,
  };

  const actionsCount = await prisma.backstorysentencesactions.count({
    where,
  });
  const array = await prisma.backstorysentencesactions.findMany({
    skip: Math.floor(Math.random() * actionsCount),
    take: 1,
    where,
  });
  if (array.length === 0) {
    return null;
  }
  return array[0];
}
