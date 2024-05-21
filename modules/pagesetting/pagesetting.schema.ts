import { z } from 'zod';
import { buildJsonSchemas } from 'fastify-zod';

import { pageSettings, settings } from 'monstershuffler-shared';

export type PageSettings = z.infer<typeof pageSettings>; 
export type Settings = z.infer<typeof settings>;

export const { schemas: pagesettingSchemas, $ref } = buildJsonSchemas({
  getPagesettingResponseSchema: pageSettings,
  setPagesettingResponseSchema: settings,
},
{ $id: 'pagesettingSchemas' });
