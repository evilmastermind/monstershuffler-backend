import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";

const id = z.number();
const userid = z.number();
const name = z.string().min(2);
const script = z.string().min(2);

const createLanguageSchema = z.object({
  name,
  script,
});

const getLanguageResponseSchema = z.object({
  id,
  userid,
  name,
  script,
});

const updateLanguageSchema = z.object({
  name,
  script,
});

const getLanguageListResponseSchema = z.object({
  list: z.array(
    z.object({
      id,
      userid,
      name,
      script,
    })
  ),
});

export type createLanguageInput = z.infer<typeof createLanguageSchema>;
export type getLanguageListResponse = z.infer<
  typeof getLanguageListResponseSchema
>;

export const { schemas: languageSchemas, $ref } = buildJsonSchemas(
  {
    createLanguageSchema,
    updateLanguageSchema,
    getLanguageResponseSchema,
    getLanguageListResponseSchema,
  },
  { $id: "languageSchemas" }
);
