import { z } from 'zod';
import { buildJsonSchemas } from 'fastify-zod';
import { actionObject } from '@/modules/schemas';


const id = z.number();
const userid = z.number();
const game = z.number();
const name = z.string().min(2);
const type = z.string().min(2);
const subtype = z.string().min(2).optional();
const source = z.string().min(2);
const actionstags = z.array(z.string()).optional();
const actionsdetails = z.object({
  name,
  type,
  subtype,
  source,
});

const getActionListSchema = z.object({
  game: game.optional(),
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
      actionsdetails,
      actionstags,
    }),
  ),
});

const getActionResponseSchema = z.object({
  id,
  userid,
  object: actionObject,
  actionsdetails,
});

const createActionSchema = z.object({
  game,
  name,
  type,
  subtype,
  source,
  tags: actionstags,
  object: actionObject,
});

const updateActionSchema = z.object({
  name,
  type,
  subtype,
  source,
  tags: actionstags,
  object: actionObject,
});

export type getActionListInput = z.infer<typeof getActionListSchema>;
export type createActionInput = z.infer<typeof createActionSchema>;
export type updateActionInput = z.infer<typeof updateActionSchema>;
export type Action = z.infer<typeof actionObject>;

export const { schemas: actionSchemas, $ref } = buildJsonSchemas({
  getActionListSchema,
  createActionSchema,
  updateActionSchema,
  getActionListResponseSchema,
  getActionResponseSchema,
}, { $id: 'actionSchemas' });
