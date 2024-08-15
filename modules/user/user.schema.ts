import { z } from 'zod';
import {
  sPostUserBody,
  sPostUserResponse,
  sLoginBody,
  sLoginResponse,
  sGetUserResponse,
  sPutUserBody,
  sActivateUserBody,
  sReactivateUserBody,
  sResetPasswordBody,
} from 'monstershuffler-shared';


export type PostUserBody = z.infer<typeof sPostUserBody>;
export type LoginBody = z.infer<typeof sLoginBody>;
export type PutUserBody = z.infer<typeof sPutUserBody>;
export type ActivateUserBody = z.infer<typeof sActivateUserBody>;
export type ReactivateUserBodyInput = z.infer<typeof sReactivateUserBody>;
export type ResetPasswordBody = z.infer<typeof sResetPasswordBody>;
