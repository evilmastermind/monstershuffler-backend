import { z } from 'zod';
import { templateObject } from 'monstershuffler-shared';
import {
  sGetTemplateListResponse,
  sGetTemplateResponse,
  sPostTemplateBody,
  sPutTemplateBody,
} from 'monstershuffler-shared';

export type PostTemplateBody = z.infer<typeof sPostTemplateBody>;
export type PutTemplateBody = z.infer<typeof sPutTemplateBody>;
export type Template = z.infer<typeof templateObject>;
