import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";
import { professionObject } from "@/schemas/character";

const id = z.number();
const userid = z.number();
const age = z.enum([
  "medieval",
  "fantasy",
  "renaissance",
  "modern",
  "future",
  "space",
  "other",
]);
const name = z.string().min(2);
const description = z.string();
const game = z.number();
const object = professionObject;

const getProfessionListResponseSchema = z.object({
  list: z.array(
    z.object({
      id,
      userid,
      name,
    })
  ),
});

const getProfessionResponseSchema = z.object({
  object,
  id,
});

const createProfessionSchema = z.object({
  object,
  age,
  description,
  game,
});

export type createProfessionInput = z.infer<typeof createProfessionSchema>;
export type Profession = z.infer<typeof professionObject>;

export const { schemas: professionSchemas, $ref } = buildJsonSchemas(
  {
    createProfessionSchema,
    getProfessionListResponseSchema,
    getProfessionResponseSchema,
  },
  { $id: "professionSchemas" }
);
