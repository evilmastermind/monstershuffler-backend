import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";
import { templateObject } from "@/schemas/character";

const id = z.number();
const userid = z.number();
const game = z.number();
const name = z.string().min(2);

const getTemplateListResponseSchema = z.object({
  list: z.array(
    z.object({
      id,
      userid,
      name,
    })
  ),
});

const getTemplateResponseSchema = z.object({
  object: templateObject,
});

const createTemplateSchema = z.object({
  object: templateObject,
  game,
});

const updateTemplateSchema = z.object({
  object: templateObject,
  game,
});

export type createTemplateInput = z.infer<typeof createTemplateSchema>;
export type updateTemplateInput = z.infer<typeof updateTemplateSchema>;
export type Template = z.infer<typeof templateObject>;

export const { schemas: templateSchemas, $ref } = buildJsonSchemas(
  {
    createTemplateSchema,
    updateTemplateSchema,
    getTemplateListResponseSchema,
    getTemplateResponseSchema,
  },
  { $id: "templateSchemas" }
);
