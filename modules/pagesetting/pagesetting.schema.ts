import { z } from 'zod';
import { pageSettings, settings } from 'monstershuffler-shared';

export type PageSettings = z.infer<typeof pageSettings>; 
export type Settings = z.infer<typeof settings>;
