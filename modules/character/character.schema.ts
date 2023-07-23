import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";
import { characterObject } from "@/schemas/character";

const id = z.number();
const userid = z.number();
const game = z.number();
const name = z.string().min(2);

const getCharacterListResponseSchema = z.object({
  list: z.array(
    z.object({
      id,
      userid,
      name,
    })
  ),
});

const getCharacterResponseSchema = z.object({
  object: characterObject,
});

const createCharacterSchema = z.object({
  game,
  name,
  object: characterObject,
});

const updateCharacterSchema = z.object({
  name,
  game,
  object: characterObject,
});

export type createCharacterInput = z.infer<typeof createCharacterSchema>;
export type updateCharacterInput = z.infer<typeof updateCharacterSchema>;
export type Character = z.infer<typeof characterObject>;

export const { schemas: characterSchemas, $ref } = buildJsonSchemas(
  {
    createCharacterSchema,
    updateCharacterSchema,
    getCharacterListResponseSchema,
    getCharacterResponseSchema,
  },
  { $id: "characterSchemas" }
);
