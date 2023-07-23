import prisma from "@/utils/prisma";
import { createProfessionInput, Profession } from "./profession.schema";

export async function createProfession(
  userid: number,
  input: createProfessionInput
) {
  const { object, description, age, game } = input;

  const response = await prisma.objects.create({
    data: {
      userid,
      object,
      type: 5,
      name: object.name,
      game,
    },
  });
  await prisma.professionsdetails.create({
    data: {
      objectid: response.id,
      name: object.name,
      femalename: object.femaleName,
      description,
      age,
    },
  });
  return response;
}

export async function getProfession(userid: number, id: number) {
  return (
    await prisma.objects.findMany({
      select: {
        object: true,
        id: true,
      },
      where: {
        id,
        type: 5,
        OR: [
          {
            userid: 0,
          },
          {
            userid,
          },
        ],
      },
    })
  )[0];
}

export async function getRandomProfession(userid: number) {
  const professionCount = await prisma.objects.count({
    where: {
      type: 2,
      OR: [
        {
          userid: 0,
        },
        {
          userid,
        },
      ],
    },
  });
  const profession = await prisma.objects.findMany({
    skip: Math.floor(Math.random() * professionCount),
    take: 1,
    select: {
      object: true,
      id: true,
    },
    where: {
      type: 5,
      OR: [
        {
          userid: 0,
        },
        {
          userid,
        },
      ],
    },
  });
  return profession[0];
}

export async function getProfessionList(userid: number) {
  const result = prisma.objects.findMany({
    select: {
      id: true,
      userid: true,
      name: true,
    },
    where: {
      type: 5,
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
        userid: "asc",
      },
      {
        name: "asc",
      },
    ],
  });
  return result;
}
export async function updateProfession(
  userid: number,
  id: number,
  input: createProfessionInput
) {
  const { object, description, age, game } = input;

  const response = await prisma.objects.updateMany({
    where: {
      id,
      userid,
      type: 5,
    },
    data: {
      object,
      game,
      name: object.name,
    },
  });

  await prisma.professionsdetails.updateMany({
    where: {
      objectid: id,
    },
    data: {
      name: object.name,
      femalename: object.femaleName,
      description,
      age,
    },
  });

  return response;
}

export async function deleteProfession(userid: number, id: number) {
  return await prisma.objects.deleteMany({
    where: {
      id,
      userid,
      type: 5,
    },
  });
}
