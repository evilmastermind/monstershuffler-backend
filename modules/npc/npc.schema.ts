import { z } from 'zod';
import {
  characterObject,
  sPostRandomNpcBody,
  sPostRandomNpcResponse,
  sPostFourRandomNpcsResponse,
  sGetGeneratorDataResponse,
  sGenerateBackstoryBody,
  sPostNpcBody,
  sPostNpcToSentAlreadyListBody,
  sAddBackstoryToNpcBody,
  sPostNpcRatingBody,
} from 'monstershuffler-shared';

export const sPostNpcRatingServiceParams = z.object({
  userid: z.number().optional(),
  sessionid: z.string().optional(),
  npcid: z.string().uuid(),
  rating: z.number(),
});

export const sGetNpcParams = z.object({
  uuid: z.string().uuid(),
});
export const sGetNpcResponse = z.object({
  id: z.string().uuid(),
  object: characterObject,
});


export type PostRandomNpcBody = z.infer<typeof sPostRandomNpcBody>;
export type PostRandomNpcResponse = z.infer<typeof sPostRandomNpcResponse>;
export type PostFourRandomNpcsResponse = z.infer<typeof sPostFourRandomNpcsResponse>;
export type GenerateBackstoryBody = z.infer<typeof sGenerateBackstoryBody>;
export type GetNpcParams = z.infer<typeof sGetNpcParams>;
export type GetNpcResponse = z.infer<typeof sGetNpcResponse>;
export type PostNpc = z.infer<typeof sPostNpcBody>;
export type PostNpcToSentAlreadyListBody = z.infer<typeof sPostNpcToSentAlreadyListBody>;
export type AddBackstoryToNpcBody = z.infer<typeof sAddBackstoryToNpcBody>;
export type PostNpcRatingBody = z.infer<typeof sPostNpcRatingBody>;
export type PostNpcRatingServiceParams = z.infer<typeof sPostNpcRatingServiceParams>;
