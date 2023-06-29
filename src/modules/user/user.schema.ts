import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";

const userCore = {
  email: z
    .string({
      required_error: "Email is a required field",
      invalid_type_error: "Email must be a string",
    })
    .email({ message: "Invalid email address" }),
  username: z
    .string({
      required_error: "Email is a required field",
      invalid_type_error: "Email must be a string",
    })
    .min(2, { message: "Username is too short (min 2 characters)" })
    .max(21, { message: "Username is too long (max 21 characters" }),
};

const createUserSchema = z.object({
  ...userCore,
  password: z
    .string({
      required_error: "Password is a required field",
      invalid_type_error: "Password must be a string",
    })
    .min(8, { message: "Password is too short (min 8 character" }),
});

const createUserResponseSchema = z.object({
  ...userCore,
  id: z.number(),
});

const activateUserSchema = z.object({
  token: z.string(),
});

const reactivateUserSchema = z.object({
  email: z.string().email(),
});

const loginSchema = z.object({
  email: z
    .string({
      required_error: "Email is a required field",
      invalid_type_error: "Email must be a string",
    })
    .email({ message: "Invalid email address" }),
  password: z.string(),
});

const loginResponseSchema = z.object({
  accessToken: z.string(),
});

const getUserResponseSchema = z.object({
  id: z.number(),
  ...userCore,
  level: z.number(),
  created: z.string().datetime(),
  publishsuspension: z.string().datetime(),
  avatar: z.string(),
});

const updateUserSchema = z.object({
  username: z.string().min(2).max(21),
  avatar: z.string(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type ActivateUserInput = z.infer<typeof activateUserSchema>;
export type ReactivateUserInput = z.infer<typeof reactivateUserSchema>;

export const { schemas: userSchemas, $ref } = buildJsonSchemas(
  {
    createUserSchema,
    createUserResponseSchema,
    activateUserSchema,
    reactivateUserSchema,
    loginSchema,
    loginResponseSchema,
    getUserResponseSchema,
    updateUserSchema,
  },
  { $id: "userSchemas" }
);
