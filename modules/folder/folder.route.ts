import { FastifyInstance } from 'fastify';
import {
  createFolderHandler,
  getFolderContentHandler,
  updateFolderHandler,
  deleteFolderHandler,
} from './folder.controller';
import { BatchPayload, jwtHeaderRequired } from '@/schemas';
import { sPostFolderBody, sPostFolderResponse, sGetFolderContentResponse } from 'monstershuffler-shared';


async function folderRoutes(server: FastifyInstance) {
  server.get(
    '/:folderId',
    {
      schema: {
        summary: 'Returns the content of a folder.',
        description: 'Returns the content of a folder.',
        tags: ['folders'],
        // params: $ref('getFolderParamsSchema'),
        headers: jwtHeaderRequired,
        response: {
          200: sGetFolderContentResponse,
        },
      },
    },
    getFolderContentHandler
  );

  server.post(
    '/',
    {
      schema: {
        summary: 'Creates a new folder.',
        description: 'Creates a new folder.',
        body: sPostFolderBody,
        tags: ['folders'],
        // params: $ref('getFolderParamsSchema'),
        headers: jwtHeaderRequired,
        response: {
          201: sPostFolderResponse,
        },
      },
    },
    createFolderHandler
  );

  server.put(
    '/:folderId',
    {
      schema: {
        summary: 'Renames a folder.',
        description: 'Renames a folder.',
        body: sPostFolderBody,
        tags: ['folders'],
        // params: $ref('getFolderParamsSchema'),
        headers: jwtHeaderRequired,
        response: {
          200: BatchPayload,
        },
      },
    },
    updateFolderHandler
  );

  server.delete(
    '/:folderId',
    {
      schema: {
        summary:
          'Deletes a folder, moving its content inside the trash folder.',
        description:
          'Deletes a folder, moving its content inside the trash folder.',
        tags: ['folders'],
        // params: $ref('getFolderParamsSchema'),
        headers: jwtHeaderRequired,
        response: {
          200: BatchPayload,
        },
      },
    },
    deleteFolderHandler
  );
}

export default folderRoutes;
