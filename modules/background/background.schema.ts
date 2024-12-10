import { z } from 'zod';
import { backgroundObject } from 'monstershuffler-shared';

import { sPostBackgroundBody } from 'monstershuffler-shared';

export type PostBackgroundBody = z.infer<typeof sPostBackgroundBody>;
export type Background = z.infer<typeof backgroundObject>;
