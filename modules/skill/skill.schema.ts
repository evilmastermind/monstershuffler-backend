import { z } from 'zod';
import { sGetSkillListResponse, sGetSkillResponse } from 'monstershuffler-shared';

export type GetSkillListResponse = z.infer<typeof sGetSkillListResponse>;
