import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";
import { racevariantObject } from "@/schemas/character";

const id = z.number();
const userid = z.number();
const game = z.number();
const name = z.string().min(2);
const raceId = z.number();

const getRacevariantListResponseSchema = z.object({
  list: z.array(
    z.object({
      id,
      userid,
      name,
    })
  ),
});

const getRacevariantResponseSchema = z.object({
  id,
  object: racevariantObject,
});

const createRacevariantSchema = z.object({
  game,
  raceId,
  object: racevariantObject,
});

const updateRacevariantSchema = z.object({
  object: racevariantObject,
});

export type createRacevariantInput = z.infer<typeof createRacevariantSchema>;
export type updateRacevariantInput = z.infer<typeof updateRacevariantSchema>;
export type Racevariant = z.infer<typeof racevariantObject>;

export const { schemas: racevariantSchemas, $ref } = buildJsonSchemas(
  {
    createRacevariantSchema,
    updateRacevariantSchema,
    getRacevariantListResponseSchema,
    getRacevariantResponseSchema,
  },
  { $id: "racevariantSchemas" }
);
