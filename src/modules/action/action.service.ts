import prisma from '@/utils/prisma';
import { createActionInput, getActionListInput } from './action.schema';

export async function createAction(userid: number, input: createActionInput) {
  const { object, name, type, subtype, source, actiontags } = input;

  const newAction = await prisma.actions.create({
    data: {
      userid,
      name: name,
      type: type,
      subtype: subtype,
      source: source,
      object,
    }
  });

  const actionId = newAction.id;

  if (actiontags) {
    await prisma.actiontags.createMany({
      data: actiontags.map((tag) => ({
        actionid: actionId,
        tag,
      })),
    });
  }

  return actionId;
}

export async function getActionList(userid: number, filters: getActionListInput) {
  const actionList = await prisma.actions.findMany({
    select: {
      id: true,
      userid: true,
      name: true,
      type: true,
      subtype: true,
      source: true,
      actiontags: true,
    },
    where: {
      name: filters.name,
      type: filters.type,
      subtype: filters.subtype,
      source: filters.source,
      actiontags: {
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
  const action = await prisma.actions.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      userid: true,
      name: true,
      type: true,
      subtype: true,
      source: true,
      object: true,
    },
  });

  return action;
}

export async function updateAction(userid: number, id: number, input: createActionInput) {
  const { object, name, type, subtype, source, actiontags } = input;
  const result = await prisma.actions.updateMany({
    where: {
      id,
      userid,
    },
    data: {
      name: name,
      type: type,
      subtype: subtype,
      source: source,
      object,
    },
  });

  await prisma.actiontags.deleteMany({
    where: {
      actionid: id,
    },
  });

  if (actiontags) {
    await prisma.actiontags.createMany({
      data: actiontags.map((tag) => ({
        actionid: id,
        tag,
      })),
    });
  }

  return result;
}

export async function deleteAction(userid: number, id: number) {
  return await prisma.actions.deleteMany({
    where: {
      id,
      userid,
    },
  });
}
