import { z } from 'zod';

import { sPostCharacterBody, sPutCharacterBody  } from 'monstershuffler-shared';

export type PostCharacterBody = z.infer<typeof sPostCharacterBody>;
export type PutCharacterBody = z.infer<typeof sPutCharacterBody>;
