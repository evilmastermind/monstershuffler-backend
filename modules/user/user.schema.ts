import { z } from 'zod';
import { buildJsonSchemas } from 'fastify-zod';
import {
  postUser,
  postUserResponse,
  loginSchema,
  loginResponse,
  getUserResponse,
  putUser,
  activateUser,
  reactivateUser,
  resetPassword,
} from 'monstershuffler-shared';


export type CreateUserInput = z.infer<typeof postUser>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateUserInput = z.infer<typeof putUser>;
export type ActivateUserInput = z.infer<typeof activateUser>;
export type ReactivateUserInput = z.infer<typeof reactivateUser>;
export type ResetPasswordInput = z.infer<typeof resetPassword>;

export const { schemas: userSchemas, $ref } = buildJsonSchemas(
  {
    postUser,
    postUserResponse,
    activateUser,
    reactivateUser,
    loginSchema,
    loginResponse,
    getUserResponse,
    putUser,
    resetPassword,
  },
  { $id: 'userSchemas' }
);
