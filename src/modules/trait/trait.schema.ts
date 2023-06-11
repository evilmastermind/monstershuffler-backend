import { z } from 'zod';
import { buildJsonSchemas } from 'fastify-zod';

const name = z.string().min(2);
const type = z.string().min(2);
const subtitle = z.boolean();
const category = z.string();
const feeling = z.boolean();
const description = z.string();


const getRandomTraitSchema = z.object({
  type: type.optional(),
  subtitle: subtitle.optional(),
  category: category.optional(),
  feeling: feeling.optional(),
});

const getRandomTraitResponseSchema = z.object({
  name,
  type,
  subtitle,
  category,
  feeling,
  description,
});

const getTraitDescriptionResponseSchema = z.object({
  description,
});

export type getRandomTraitInput = z.infer<typeof getRandomTraitSchema>;
export type getRandomTraitResponse = z.infer<typeof getRandomTraitResponseSchema>;
export type getTraitDescriptionResponse = z.infer<typeof getTraitDescriptionResponseSchema>;

export const {schemas: traitSchemas, $ref} = buildJsonSchemas({
  getRandomTraitSchema,
  getRandomTraitResponseSchema,
  getTraitDescriptionResponseSchema
}, { $id: 'traitSchemas' });
