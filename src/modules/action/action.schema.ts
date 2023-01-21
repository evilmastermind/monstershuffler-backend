import { z } from 'zod';
import { buildJsonSchemas } from 'fastify-zod';
import { actionObject } from '@/modules/schemas';


const id = z.number();
const userid = z.number();
const name = z.string().min(2);
const type = z.string().min(2);
const subtype = z.string().min(2).optional();
const source = z.string().min(2);
const actiontags = z.array(z.string()).optional();


const getActionListSchema = z.object({
  name: name.optional(),
  type: type.optional(),
  subtype: subtype.optional(),
  source: source.optional(),
  tag: z.string().optional(),
});

const getActionListResponseSchema = z.object({
  list: z.array(
    z.object({
      id,
      userid,
      name,
      type,
      subtype,
      source,
      actiontags,
    }),
  ),
});

const getActionResponseSchema = z.object({
  id,
  userid,
  name,
  type,
  subtype,
  source,
  object: actionObject,
});

const createActionSchema = z.object({
  name,
  type,
  subtype,
  source,
  actiontags,
  object: actionObject,
});

export type getActionListInput = z.infer<typeof getActionListSchema>;
export type createActionInput = z.infer<typeof createActionSchema>;
export type Action = z.infer<typeof actionObject>;

export const { schemas: actionSchemas, $ref } = buildJsonSchemas({
  getActionListSchema,
  createActionSchema,
  getActionListResponseSchema,
  getActionResponseSchema,
}, { $id: 'actionSchemas' });
