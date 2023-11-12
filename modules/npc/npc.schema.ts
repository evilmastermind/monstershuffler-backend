import { z } from 'zod';
import { buildJsonSchemas } from 'fastify-zod';
import { postRandomNpcInput, postRandomNpcResponse, postFourRandomNpcsResponse, getGeneratorDataResponse } from 'monstershuffler-shared';


export type PostRandomNpcInput = z.infer<typeof postRandomNpcInput>;

export const { schemas: npcSchemas, $ref } = buildJsonSchemas(
  {
    postRandomNpcInput,
    postRandomNpcResponse,
    postFourRandomNpcsResponse,
    getGeneratorDataResponse,
  },
  { $id: 'npcSchemas' }
);
