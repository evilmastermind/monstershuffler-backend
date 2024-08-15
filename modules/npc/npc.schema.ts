import { z } from 'zod';
import {
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
  npcid: z.number(),
  rating: z.number(),
});

export type PostRandomNpcBody = z.infer<typeof sPostRandomNpcBody>;
export type PostRandomNpcResponse = z.infer<typeof sPostRandomNpcResponse>;
export type PostFourRandomNpcsResponse = z.infer<typeof sPostFourRandomNpcsResponse>;
export type GenerateBackstoryBody = z.infer<typeof sGenerateBackstoryBody>;
export type PostNpc = z.infer<typeof sPostNpcBody>;
export type PostNpcToSentAlreadyListBody = z.infer<typeof sPostNpcToSentAlreadyListBody>;
export type AddBackstoryToNpcBody = z.infer<typeof sAddBackstoryToNpcBody>;
export type PostNpcRatingBody = z.infer<typeof sPostNpcRatingBody>;
export type PostNpcRatingServiceParams = z.infer<typeof sPostNpcRatingServiceParams>;
