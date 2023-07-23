import { createTemplateInput, updateTemplateInput } from "./template.schema";
import { FastifyReply, FastifyRequest } from "fastify";
import {
  createTemplate,
  getTemplate,
  getTemplateList,
  updateTemplate,
  deleteTemplate,
} from "./template.service";
import { handleError } from "@/utils/errors";

export async function getTemplateListHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = request.user || { id: 0 };
  try {
    const templateList = await getTemplateList(id);
    return reply.code(200).send({
      list: templateList,
    });
  } catch (error) {
    return handleError(error, reply);
  }
}

export async function getTemplateHandler(
  request: FastifyRequest<{
    Params: {
      templateId: string;
    };
  }>,
  reply: FastifyReply
) {
  const { id } = request.user || { id: 0 };
  const templateId = request.params.templateId;
  try {
    const templateObject = await getTemplate(id, parseInt(templateId));
    return reply.code(200).send(templateObject[0]);
  } catch (error) {
    return handleError(error, reply);
  }
}

export async function createTemplateHandler(
  request: FastifyRequest<{ Body: createTemplateInput }>,
  reply: FastifyReply
) {
  try {
    const { body } = request;
    const { id } = request.user;
    const templateObject = await createTemplate(id, body);
    return reply.code(201).send(templateObject);
  } catch (error) {
    return handleError(error, reply);
  }
}

export async function updateTemplateHandler(
  request: FastifyRequest<{
    Params: {
      templateId: string;
    };
    Body: updateTemplateInput;
  }>,
  reply: FastifyReply
) {
  try {
    const { id } = request.user;
    const { body } = request;
    const templateId = request.params.templateId;
    const templateObject = await updateTemplate(id, parseInt(templateId), body);
    return reply.code(200).send(templateObject);
  } catch (error) {
    return handleError(error, reply);
  }
}

export async function deleteTemplateHandler(
  request: FastifyRequest<{
    Params: {
      templateId: string;
    };
  }>,
  reply: FastifyReply
) {
  try {
    const { id } = request.user;
    const templateId = request.params.templateId;
    const templateObject = await deleteTemplate(id, parseInt(templateId));
    return reply.code(200).send(templateObject);
  } catch (error) {
    return handleError(error, reply);
  }
}
