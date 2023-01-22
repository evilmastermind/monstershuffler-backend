import { z } from 'zod';
import { buildJsonSchemas } from 'fastify-zod';

const id = z.number().int().positive();
const name = z.string().min(2);
const adds = z.number().int().nonnegative().optional();
const url = z.string().optional();
const negativeratings = z.number().int().optional();
const positiveratings = z.number().int().optional();

const folders = z.array(
  z.object({
    id,
    name,
  })
);

const characters = z.array(
  z.object({
    id,
    name,
    size: z.number().int().positive(),
    type: z.string(),
    cr: z.number().int().positive(),
    meta: z.string(),
    adds,
    url,
    negativeratings,
    positiveratings,
  })
);

const races = z.array(
  z.object({
    id,
    name,
    adds,
    url,
    negativeratings,
    positiveratings,
  })
);

const classes = z.array(
  z.object({
    id,
    name,
    adds,
    url,
    negativeratings,
    positiveratings,
  })
);

const templates = z.array(
  z.object({
    id,
    name,
    adds,
    url,
    negativeratings,
    positiveratings,
  })
);

const getFolderContentResponseSchema = z.object({
  folders,
  characters,
  races,
  classes,
  templates,
});

const createFolderSchema = z.object({
  name,
});

const createFolderResponseSchema = z.object({
  id,
  name,
});

export type CreateFolderInput = z.infer<typeof createFolderSchema>;

export const { schemas: folderSchemas, $ref} = buildJsonSchemas({
  createFolderSchema,
  createFolderResponseSchema,
  getFolderContentResponseSchema,
}, { $id: 'folderSchemas' });
