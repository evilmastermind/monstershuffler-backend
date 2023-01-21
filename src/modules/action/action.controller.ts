import { createActionInput, getActionListInput } from './action.schema';
import { FastifyReply, FastifyRequest } from 'fastify';
import { createAction, getAction, getActionList, updateAction, deleteAction } from './action.service';
import { handleError } from '@/utils/errors';


export async function getActionListHandler (
  request: FastifyRequest<{ Body: getActionListInput }>,
  reply: FastifyReply
) {
  const { body } = request;
  const { id } = request.user  || { id: 0 };
  try {
    const actionList = await getActionList(id, body);
    return reply.code(200).send({
      list: actionList
    });
  } catch (error) {
    return handleError(error, reply);
  }
}

export async function getActionHandler (
  request: FastifyRequest<{
    Params: {
      actionId: string;
    } 
  }>,
  reply: FastifyReply
) {
  const { id } = request.user || { id: 0 };
  const actionId = request.params.actionId;
  try {
    const actionObject = await getAction(id, parseInt(actionId));
    return reply.code(200).send(actionObject);
  } catch (error) {
    return handleError(error, reply);
  }
}

export async function createActionHandler (
  request: FastifyRequest<{Body: createActionInput }>,
  reply: FastifyReply
) {
  try {
    const { body } = request;
    const { id } = request.user;
    const actionObject = await createAction(id, body);
    return reply.code(201).send(actionObject);
  } catch (error) {
    return handleError(error, reply);
  }
}

export async function updateActionHandler (
  request: FastifyRequest<{
    Params: {
      actionId: string;
    },
    Body: createActionInput
  }>,
  reply: FastifyReply
) {
  try {
    const { body } = request;
    const { id } = request.user;
    const actionId = request.params.actionId;
    const actionObject = await updateAction(id, parseInt(actionId), body);
    return reply.code(200).send(actionObject);
  } catch (error) {
    return handleError(error, reply);
  }
}

export async function deleteActionHandler (
  request: FastifyRequest<{
    Params: {
      actionId: string;
    } 
  }>,
  reply: FastifyReply
) {
  try {
    const { id } = request.user;
    const actionId = request.params.actionId;
    await deleteAction(id, parseInt(actionId));
    return reply.code(200).send();
  } catch (error) {
    return handleError(error, reply);
  }
}
