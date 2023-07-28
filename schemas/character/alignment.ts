import { z } from 'zod';

export const alignmentModifiersSingle = z.tuple([
  z.number(),
  z.number(),
  z.number(),
]);
export const alignmentModifiers = z.tuple([
  z.tuple([z.number(), z.number(), z.number()]),
  z.tuple([z.number(), z.number(), z.number()]),
]);

export const alignmentEthical = z.enum([
  'Lawful',
  'Neutral',
  'Chaotic',
  'Any',
  'Unaligned',
]);
export const alignmentMoral = z.enum(['Good', 'Neutral', 'Evil', 'Any']);

export const alignmentStats = {
  alignmentEthical: alignmentEthical.optional(),
  alignmentMoral: alignmentMoral.optional(),
};
