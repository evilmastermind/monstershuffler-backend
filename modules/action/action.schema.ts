import { z } from 'zod';
import { buildJsonSchemas } from 'fastify-zod';
import { actionObject } from 'monstershuffler-shared';
import { getActionList, getActionListResponse, getActionResponse, postAction, putAction } from 'monstershuffler-shared';

export type GetActionListInput = z.infer<typeof getActionList>;
export type PostActionInput = z.infer<typeof postAction>;
export type PutActionInput = z.infer<typeof putAction>;
export type Action = z.infer<typeof actionObject>;

export const { schemas: actionSchemas, $ref } = buildJsonSchemas(
  {
    getActionList,
    postAction,
    putAction,
    getActionListResponse,
    getActionResponse,
  },
  { $id: 'actionSchemas' }
);
