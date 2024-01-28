import {
  AgeObject,
  backgroundObject,
  characterObject,
  choiceListObject,
  choiceRandomObject,
  classObject,
  classvariantObject,
  raceObject,
  racevariantObject,
  statObject,
  voiceObject,
  WeightObject,
} from 'monstershuffler-shared';
import { z } from 'zod';

export type Character = z.infer<typeof characterObject>;
export type Choice = z.infer<typeof statObject>;
export type ChoiceListObject = z.infer<typeof choiceListObject>;
export type ChoiceRandomObject = z.infer<typeof choiceRandomObject>;
export type Race = z.infer<typeof raceObject>;
export type Racevariant = z.infer<typeof racevariantObject>;
export type Class = z.infer<typeof classObject>;
export type Classvariant = z.infer<typeof classvariantObject>;
export type Age = z.infer<typeof AgeObject>;
export type Weight = z.infer<typeof WeightObject>;
export type Voice = z.infer<typeof voiceObject>;
export type Background = z.infer<typeof backgroundObject>;
