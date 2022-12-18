import  { z } from 'zod';
import { buildJsonSchemas } from 'fastify-zod';


const userCore = {
  email: z
    .string({
      required_error: 'Email is a required field',
      invalid_type_error: 'Email must be a string',
    })
    .email({ message: 'Invalid email address' }),
  username: z
    .string({
      required_error: 'Email is a required field',
      invalid_type_error: 'Email must be a string',
    })
    .min(2, { message: 'Username is too short (min 2 characters)' })
    .max(21, { message: 'Username is too long (max 21 characters' }),
};

const createUserSchema = z.object({
  ...userCore,
  password: z
    .string({
      required_error: 'Password is a required field',
      invalid_type_error: 'Password must be a string',
    })
    .min(8, { message: 'Password is too short (min 8 character' })
});


const createUserResponseSchema = z.object({
  ...userCore,
  id: z.number()
});


const loginSchema = z.object({
  email: z
    .string({
      required_error: 'Email is a required field',
      invalid_type_error: 'Email must be a string',
    })
    .email({ message: 'Invalid email address' }),
  password: z.string(),
});

const loginResponseSchema = z.object({
  accessToken: z.string(),
});


export type CreateUserInput = z.infer<typeof createUserSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

export const {schemas: userSchemas, $ref} = buildJsonSchemas({
  createUserSchema,
  createUserResponseSchema,
  loginSchema,
  loginResponseSchema,
}, { $id: 'userSchemas' });