import { z } from 'zod';
import { sGetRandomVoiceResponse, sGetRandomVoiceBody } from 'monstershuffler-shared';

export type GetRandomVoiceInput = z.infer<typeof sGetRandomVoiceBody>;
