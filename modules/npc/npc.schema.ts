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

export const generateBackstoryInput = z.object({
  id: z.number(),
});

export const postNpc = z.object({
  object: characterObject,
  userid: z.number().optional(),
  sessionid: z.string().optional(),
});

export const postNpcRatingInput = z.object({
  id: z.number(),
  rating: z.number(),
  sessionid: z.string().optional(),
});

export const postNpcRating = z.object({
  userid: z.number().optional(),
  sessionid: z.string().optional(),
  npcid: z.number(),
  rating: z.number(),
});

export const postNpcRatingResponse = z.object({
  id: z.number(),
  rating: z.number()
});

export const postNpcToSentAlreadyListInput = z.object({
  npcid: z.number(),
  userid: z.number().optional(),
  sessionid: z.string().optional(),
});

export const addBackstoryToNpcInput = z.object({
  id: z.number(),
  backstory: z.string(),
  object: characterObject,
});

export type GenerateBackstoryInput = z.infer<typeof generateBackstoryInput>;
export type PostNpc = z.infer<typeof postNpc>;
export type PostNpcToSentAlreadyListInput = z.infer<typeof postNpcToSentAlreadyListInput>;
export type AddBackstoryToNpcInput = z.infer<typeof addBackstoryToNpcInput>;
export type PostNpcRatingInput = z.infer<typeof postNpcRatingInput>;
export type PostNpcRating = z.infer<typeof postNpcRating>;

export const { schemas: npcSchemas, $ref } = buildJsonSchemas(
  {
    postRandomNpcInput,
    postNpcRatingInput,
    postNpcRatingResponse,
    postRandomNpcResponse,
    postFourRandomNpcsResponse,
    getGeneratorDataResponse,
    generateBackstoryInput,
    generateTextResponse,
  },
  { $id: 'npcSchemas' }
);
