import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";
import { classvariantObject } from "@/schemas/character";

const id = z.number();
const userid = z.number();
const game = z.number();
const name = z.string().min(2);
const classId = z.number();

const getClassvariantListResponseSchema = z.object({
  list: z.array(
    z.object({
      id,
      userid,
      name,
      objects: z.object({
        id,
        name,
      }),
    })
  ),
});

const getClassvariantClassListResponseSchema = z.object({
  list: z.array(
    z.object({
      id,
      userid,
      name,
    })
  ),
});

const getClassvariantResponseSchema = z.object({
  object: classvariantObject,
  id,
});

const createClassvariantSchema = z.object({
  game,
  classId,
  object: classvariantObject,
});

const updateClassvariantSchema = z.object({
  object: classvariantObject,
});

export type createClassvariantInput = z.infer<typeof createClassvariantSchema>;
export type updateClassvariantInput = z.infer<typeof updateClassvariantSchema>;
export type Classvariant = z.infer<typeof classvariantObject>;

export const { schemas: classvariantSchemas, $ref } = buildJsonSchemas(
  {
    createClassvariantSchema,
    updateClassvariantSchema,
    getClassvariantListResponseSchema,
    getClassvariantClassListResponseSchema,
    getClassvariantResponseSchema,
  },
  { $id: "classvariantSchemas" }
);
