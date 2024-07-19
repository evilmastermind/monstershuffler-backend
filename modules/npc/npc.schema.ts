import { z } from 'zod';
import { buildJsonSchemas } from 'fastify-zod';
import {
  postRandomNpcInput,
  postRandomNpcResponse,
  postFourRandomNpcsResponse,
  getGeneratorDataResponse,
} from 'monstershuffler-shared';
import { generateTextResponse } from '@/modules/ai/ai.schema';
import { characterObject } from 'monstershuffler-shared';

export type PostRandomNpcInput = z.infer<typeof postRandomNpcInput>;
export type PostRandomNpcResponse = z.infer<typeof postRandomNpcResponse>;
export type PostFourRandomNpcsResponse = z.infer<typeof postFourRandomNpcsResponse>;

export const postBackstoryInput = z.object({
  token: z.string(),
  object: characterObject,
});

export type PostBackstoryInput = z.infer<typeof postBackstoryInput>;


export const { schemas: npcSchemas, $ref } = buildJsonSchemas(
  {
    postRandomNpcInput,
    postRandomNpcResponse,
    postFourRandomNpcsResponse,
    getGeneratorDataResponse,
    postBackstoryInput,
    generateTextResponse,
  },
  { $id: 'npcSchemas' }
);
