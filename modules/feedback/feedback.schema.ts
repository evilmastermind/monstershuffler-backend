import { z } from 'zod';
import { sGetRandomQuestionBody, sPostAnswerBody } from 'monstershuffler-shared';

export type GetRandomQuestionBody = z.infer<typeof sGetRandomQuestionBody>;
export type PostAnswerBody = z.infer<typeof sPostAnswerBody>;
