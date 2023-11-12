import { z } from 'zod';
import { buildJsonSchemas } from 'fastify-zod';
import { postFolder, postFolderResponse, getFolderContentResponse } from 'monstershuffler-shared';

export type CreateFolderInput = z.infer<typeof postFolder>;

export const { schemas: folderSchemas, $ref } = buildJsonSchemas(
  {
    postFolder,
    postFolderResponse,
    getFolderContentResponse,
  },
  { $id: 'folderSchemas' }
);
