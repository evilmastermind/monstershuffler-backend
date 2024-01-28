import { FastifyInstance } from 'fastify';
import {
  createFolderHandler,
  getFolderContentHandler,
  updateFolderHandler,
  deleteFolderHandler,
} from './folder.controller';
import { BatchPayload, jwtHeaderRequired } from '@/schemas';
import { $ref } from './folder.schema';

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
          200: $ref('getFolderContentResponse'),
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
        body: $ref('postFolder'),
        tags: ['folders'],
        // params: $ref('getFolderParamsSchema'),
        headers: jwtHeaderRequired,
        response: {
          201: $ref('postFolderResponse'),
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
        body: $ref('postFolder'),
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
