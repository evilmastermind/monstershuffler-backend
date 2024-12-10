import { z } from 'zod';
import { sGetRandomTraitBody, sGetRandomTraitResponse, sGetTraitDescriptionResponse } from 'monstershuffler-shared';

export type sGetRandomTraitBodyInput = z.infer<typeof sGetRandomTraitBody>;
export type sGetRandomTraitResponse = z.infer<
  typeof sGetRandomTraitResponse
>;
export type GetTraitDescriptionResponse = z.infer<
  typeof sGetTraitDescriptionResponse
>;
