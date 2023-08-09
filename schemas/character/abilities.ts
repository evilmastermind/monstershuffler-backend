import { z } from 'zod';

export const abilitiesEnum = z.enum(['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA']);

const abilityScore = z.object({
  value: z.number(),
  isAutomaticCalcDisabled: z.boolean().optional(),
});

export const abilityScoresObject = z.object({
  STR: abilityScore.optional(),
  DEX: abilityScore.optional(),
  CON: abilityScore.optional(),
  INT: abilityScore.optional(),
  WIS: abilityScore.optional(),
  CHA: abilityScore.optional(),
});
