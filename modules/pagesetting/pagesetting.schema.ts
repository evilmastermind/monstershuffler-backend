import { z } from 'zod';
import { buildJsonSchemas } from 'fastify-zod';

const pageSettings = z.object({
  page: z.string(),
  object: z.record(z.any()),
});

const Settings = z.record(z.any());


export type PageSettings = z.infer<typeof pageSettings>; 
export type Settings = z.infer<typeof Settings>;

export const { schemas: pagesettingSchemas, $ref } = buildJsonSchemas({
  getPagesettingResponseSchema: pageSettings,
  setPagesettingResponseSchema: Settings,
});
