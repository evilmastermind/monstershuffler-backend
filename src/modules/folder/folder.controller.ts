import { CreateFolderInput } from './folder.schema';
import { FastifyReply, FastifyRequest } from 'fastify';
import { createFolder, getFolderContent, updateFolder, deleteFolder } from './folder.service';
import { handleError } from '@/utils/errors';

export async function getFolderContentHandler (
  request: FastifyRequest<{
    Params: {
      folderId: string;
    } 
  }>,
  reply: FastifyReply
) {
  const { id } = request.user  || { id: 0 };
  const folderId = request.params.folderId;
  try {
    const folderContent = await getFolderContent(id, parseInt(folderId));
    return reply.code(200).send({
      content: folderContent
    });
  } catch (error) {
    return handleError(error, reply);
  }
}

export async function createFolderHandler (
  request: FastifyRequest<{Body: CreateFolderInput }>,
  reply: FastifyReply
) {
  try {
    const { body } = request;
    const { id } = request.user;
    const folderObject = await createFolder(id, body);
    return reply.code(201).send(folderObject);
  } catch (error) {
    return handleError(error, reply);
  }
}

export async function updateFolderHandler (
  request: FastifyRequest<{
    Params: {
      folderId: string;
    },
    Body: CreateFolderInput
  }>,
  reply: FastifyReply
) {
  try {
    const { id } = request.user;
    const { folderId } = request.params;
    const { body } = request;
    const folderObject = await updateFolder(id, parseInt(folderId), body);
    return reply.code(200).send(folderObject);
  } catch (error) {
    return handleError(error, reply);
  }
}

export async function deleteFolderHandler (
  request: FastifyRequest<{
    Params: {
      folderId: string;
    }
  }>,
  reply: FastifyReply
) {
  try {
    const { id } = request.user;
    const { folderId } = request.params;
    const folderObject = await deleteFolder(id, parseInt(folderId));
    return reply.code(200).send(folderObject);
  } catch (error) {
    return handleError(error, reply);
  }
}
