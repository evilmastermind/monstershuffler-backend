import prisma from '@/utils/prisma';
import { createActionInput, getActionListInput, updateActionInput } from './action.schema';

export async function createAction(userid: number, input: createActionInput) {
  const { object, game, name, type, subtype, source, tags } = input;

  const newObject = await prisma.objects.create({
    data: {
      game,
      type: 101,
      userid,
      name,
      object,
    }
  });

  const newActionDetails = await prisma.actionsdetails.create({
    data: {
      objectid: newObject.id,
      name,
      actiontype: type,
      subtype,
      source,
    }
  });

  if (tags) {
    await prisma.actionstags.createMany({
      data: tags.map((tag) => ({
        objectid: newObject.id,
        tag,
      })),
    });
  }

  return {...newActionDetails, object: newObject.object } ;
}

export async function getActionList(userid: number, filters: getActionListInput) {
  
  const actionList = await prisma.objects.findMany({
    select: {
      id: true,
      userid: true,
      actionsdetails: true,
      actionstags: true,
    },
    where: {
      game: filters.game,
      type: 101,
      actionsdetails: {
        name: {
          contains: filters.name,
        },
        actiontype: {
          contains: filters.type,
        },
        subtype: {
          contains: filters.subtype,
        },
        source: {
          contains: filters.source,
        },
      },
      actionstags: {
        some: {
          tag: filters.tag,
        },
      },
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

  return actionList;
}

export async function getAction(userid: number, id: number) {
  const action = await prisma.objects.findUnique({
    select: {
      id: true,
      userid: true,
      object: true,
      actionsdetails: {
        select: {
          name: true,
          actiontype: true,
          subtype: true,
          source: true,
        },
      }
    },
    where: {
      id,
    },
  });

  return action;
}

export async function updateAction(userid: number, id: number, input: updateActionInput) {
  const { object, name, type, subtype, source, tags } = input;
  const result = await prisma.objects.updateMany({
    where: {
      id,
      userid,
    },
    data: {
      name: name,
      object,
    },
  });

  await prisma.actionsdetails.updateMany({
    where: {
      objectid: id,
    },
    data: {
      name,
      actiontype: type,
      subtype,
      source,
    },
  });

  await prisma.actionstags.deleteMany({
    where: {
      objectid: id,
    },
  });

  if (tags) {
    await prisma.actionstags.createMany({
      data: tags.map((tag) => ({
        objectid: id,
        tag,
      })),
    });
  }

  return result;
}

export async function deleteAction(userid: number, id: number) {
  return await prisma.objects.deleteMany({
    where: {
      id,
      userid,
    },
  });
}
