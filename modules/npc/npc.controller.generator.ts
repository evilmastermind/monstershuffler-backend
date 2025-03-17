import { PostRandomNpcBody } from './npc.schema';
import { FastifyReply, FastifyRequest } from 'fastify';
import { getRace, getRandomRace } from '@/modules/race/race.service';
import {
  getRacevariant,
  getRandomRacevariant,
} from '@/modules/racevariant/racevariant.service';
import type { Character, Race, Racevariant, Class, Classvariant, Age, Weight, Background } from '@/types';
import { getClass, getRandomClass } from '@/modules/class/class.service';
import {
  getClassvariant,
  getRandomClassvariant,
} from '@/modules/classvariant/classvariant.service';
import {
  getBackground,
  getRandomBackgroundForAge,
} from '@/modules/background/background.service';
import { getRandomSkill } from '@/modules/skill/skill.service';
import { sGetRandomTraitBodyForAge } from '@/modules/trait/trait.service';
import { getRandomActionForCharacterhook, getRandomCharacterhook } from '@/modules/characterhook/characterhook.service';
import { handleError } from '@/utils/errors';
import { random } from '@/utils/functions';
import { findChoices } from '@/modules/choiceSolver';
import { adjustLevel, createStats, createUserObjectIfNotExists, calculateAlignmentFromModifiers, calculateAlignmentNumber, parseDescriptionChoices, Action } from 'monstershuffler-shared';
import { calculateLevel } from './stats';
import { calculateVoice, calculatePronouns, calculateName, calculateSurname, calculateAlignment, calculateHeight, calculateWeight, calculateAge } from './roleplayStats';

export async function createRandomNpc(
  request: FastifyRequest<{ Body: PostRandomNpcBody }>,
  reply: FastifyReply
) {
  const { id } = request.user || { id: 0 };
  const {
    levelType,
    classType,
    classId,
    classvariantId,
    backgroundType,
    backgroundId,
    primaryRaceId,
    secondaryRaceId,
    primaryRacePercentage = 0,
    secondaryRacePercentage = 0,
    primaryRacevariantId,
    secondaryRacevariantId,
    includeChildren,
    pronounsChosen,
    alignmentEthicalChosen,
    alignmentMoralChosen,
    CRChosen
  } = request.body;

  try {
    ///////////////////////////////////////
    // R A C E / S P E C I E S
    ///////////////////////////////////////
    const random100 = random(1, 100);
    let race: Race | null = null;
    let racevariant: Racevariant | null = null;
    if (
      primaryRaceId &&
      random100 <= primaryRacePercentage
    ) {
      const raceResult = await getRace(id, primaryRaceId);
      const raceVariantResult = primaryRacevariantId? await getRacevariant(id, primaryRacevariantId) : await getRandomRacevariant(id, primaryRaceId);
      if (raceResult) {
        race = raceResult.object;
      }
      if (raceVariantResult) {
        racevariant = raceVariantResult.object;
      }
    } else if (
      secondaryRaceId &&
      random100 <= (primaryRacePercentage + secondaryRacePercentage)
    ) {
      const raceResult = await getRace(id, secondaryRaceId);
      const raceVariantResult = secondaryRacevariantId? await getRacevariant(id, secondaryRacevariantId) : await getRandomRacevariant(id, secondaryRaceId);
      if (raceResult) {
        race = raceResult.object;
      }
      if (raceVariantResult) {
        racevariant = raceVariantResult.object;
      }
    } else {
      const result = await getRandomRace(id);
      if (result) {
        race = result.object as Race;
        racevariant =
          ((await getRandomRacevariant(id, result.id))?.object as Racevariant) ||
          null;
      }
    }
    ///////////////////////////////////////
    // A G E
    ///////////////////////////////////////
    const age: Age = race? calculateAge(race, includeChildren) : { string: 'adult', number: 0 };
    ///////////////////////////////////////
    // C L A S S   &   B A C K G R O U N D
    ///////////////////////////////////////
    let classChosen: Class | null = null;
    let classvariant: Classvariant | null = null;
    let background: Background | null = null;
    const random20 = classType === 'randomSometimes' ? random(1, 20) : 0;
    if (classId && classType === 'specific') {
      const classResult = await getClass(id, classId);
      const classvariantResult = classvariantId? await getClassvariant(id, classvariantId) : await getRandomClassvariant(id, classId);
      if (classResult) {
        classChosen = classResult.object;
      }
      if (classvariantResult) {
        classvariant = classvariantResult.object;
      }
    } else if (classType === 'randomAlways' || random20 === 20) {
      const result = await getRandomClass(id);
      if (result) {
        classChosen = result.object as Class;
        classvariant =
          ((await getRandomClassvariant(id, result.id))
            ?.object as Classvariant) || null;
      }
    }
    if (backgroundType === 'random') {
      const backgroundResult = await getRandomBackgroundForAge(id, age.string);
      if (backgroundResult) {
        background = backgroundResult.object;
      }
    } else if (backgroundId && backgroundType === 'specific') {
      const backgroundResult = await getBackground(id, backgroundId);
      if (backgroundResult) {
        background = backgroundResult.object;
      }
    }

    ///////////////////////////////////////
    // L E V E L
    ///////////////////////////////////////
    const level = calculateLevel(levelType);
    ///////////////////////////////////////
    // R O L E P L A Y   F E A T U R E S
    ///////////////////////////////////////
    const pronouns = pronounsChosen || calculatePronouns(race, racevariant);
    const name = await calculateName(pronouns, race) || 'Character Name';
    const surname = await calculateSurname(pronouns, race);
    const favouriteSkill = await getRandomSkill();
    const traitObject = await sGetRandomTraitBodyForAge({ feeling: 0 }, age.string);
    const feelingObject = await sGetRandomTraitBodyForAge({ feeling: 1 }, age.string);
    const alignmentModifiers = calculateAlignment(traitObject?.category);
    const alignmentEthical = alignmentEthicalChosen;
    const alignmentMoral = alignmentMoralChosen;
    const height = race? calculateHeight(race, age, pronouns) : 0;
    const weight = calculateWeight();
    const voice = await calculateVoice(pronouns);


    const result: Character = {
      character: {
        name,
        pronouns,
        age,
        weight,
        alignmentModifiers,
        ...(surname !== null && { surname }),
        ...(traitObject !== null && { trait: { name: traitObject.name, description: traitObject.description || '' } }),
        ...(feelingObject !== null && { feeling: { name: feelingObject.name, description: feelingObject.description || '' } }),
        ...(voice !== null && { voice }),
        ...(height > 0 && { height }),
        ...(alignmentEthical !== undefined && { alignmentEthical }),
        ...(alignmentMoral !== undefined && { alignmentMoral }),
      },
      variations: {
        ...(CRChosen !== undefined && { currentCR: CRChosen }),
        ...(CRChosen === undefined && { currentHD: level }),
      }
    };

    if (favouriteSkill) {
      createUserObjectIfNotExists(result);
      result.character.user!.skills = [{
        value: favouriteSkill.name,
      }];
    }

    const character = result.character;
    if (race) {
      character['race'] = race;
      await findChoices(character.race, character.race, 0, id);
    }
    if (race && racevariant) {
      character['racevariant'] = racevariant;
      await findChoices(character.racevariant, character.racevariant, 0, id);
    }
    if (classChosen) {
      character['class'] = classChosen;
      await findChoices(character.class, character.class, 0, id);
    }
    if (classChosen && classvariant) {
      character['classvariant'] = classvariant;
      await findChoices(character.classvariant, character.classvariant, 0, id);
    }
    if (background) {
      character['background'] = background;
      await findChoices(character.background, character.background, 0, id);
    }

    character.CRCalculation =  { name: 'npcstandard'};

    calculateAlignmentFromModifiers(result);
    addCharacterHooks(result);
    adjustLevel(result);
    createStats(result);


    return {
      npc: result,
    };
  } catch (error) {
    console.warn(error);
    return handleError(error, reply);
  }
}


export async function addCharacterHooks(character: Character) {
  // Retrieving character hooks
    
  const c = character.character;
  if (!c.characterHooks) {
    c.characterHooks = [];
  }
  const types: Array<'youth' | 'career' | 'plot'> = ['youth'];
  if (!['child','adolescent'].includes(c.age?.string || '') ) {
    types.push(random(1,2) === 1 ? 'career' : 'plot');
  }

  const locationorclass = c.class?.name || c?.background?.workplace;
  const alignment = calculateAlignmentNumber(c.alignmentEthical || 'Neutral', c.alignmentMoral || 'Neutral');

  const hookWithLocationIndex = random(0, types.length - 1);

  for (let i = 0; i < types.length; i++) {
    const newHook = await getRandomCharacterhook({
      type: types[i],
      locationorclass: i === hookWithLocationIndex ? locationorclass : undefined,
      alignment,
    });
    if (!newHook) {
      continue;
    }

    newHook.sentence = parseDescriptionChoices(newHook.sentence);
    newHook.summary = parseDescriptionChoices(newHook.summary);
    c.characterHooks.push(newHook);
      
    const action = await getRandomActionForCharacterhook(newHook.id);
    if (!action || !action.object) {
      continue;
    }
    if (!c.user) {
      c.user = {};
    }
    if (!c.user?.actions?.length) {
      c.user.actions = [];
    }
    c.user.actions.push(action.object as Action);
  }
}
