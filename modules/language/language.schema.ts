import { z } from 'zod';
import {
  sPostLanguageBody,
  sPutLanguageBody,
  sGetLanguageResponse,
  sGetLanguageListResponse,
} from 'monstershuffler-shared';

export type PostLanguageBody = z.infer<typeof sPostLanguageBody>;
export type GetLanguageListResponse = z.infer<
  typeof sGetLanguageListResponse
>;
