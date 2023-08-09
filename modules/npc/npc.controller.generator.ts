import { createRandomNpcInput } from './npc.schema';
import { FastifyReply, FastifyRequest } from 'fastify';
import { getRace, getRandomRace } from '@/modules/race/race.service';
import {
  getRacevariant,
  getRandomRacevariant,
} from '@/modules/racevariant/racevariant.service';
import { Character } from '@/modules/character/character.schema';
import { Race } from '@/modules/race/race.schema';
import { Racevariant } from '@/modules/racevariant/racevariant.schema';
import { Class } from '@/modules/class/class.schema';
import { Classvariant } from '@/modules/classvariant/classvariant.schema';
import { getClass, getRandomClass } from '@/modules/class/class.service';
import {
  getClassvariant,
  getRandomClassvariant,
} from '@/modules/classvariant/classvariant.service';
import {
  getBackground,
  getRandomBackground,
} from '@/modules/background/background.service';
import { Background } from '@/modules/background/background.schema';
import { getRandomSkill } from '@/modules/skill/skill.service';
import { getRandomName } from '@/modules/name/name.service';
import { getRandomSurname } from '@/modules/surname/surname.service';
import { getRandomTrait } from '@/modules/trait/trait.service';
import { getRandomCharacterhook } from '@/modules/characterhook/characterhook.service';
import { handleError } from '@/utils/errors';
import { random } from '@/utils/functions';
import { findChoices } from '@/modules/choiceSolver';

export async function createRandomNpc(
  request: FastifyRequest<{ Body: createRandomNpcInput }>,
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
    primaryRacePercentage,
    secondaryRacePercentage,
    primaryRacevariantId,
    secondaryRacevariantId,
  } = request.body;

  try {
    ///////////////////////////////////////
    // R A C E
    ///////////////////////////////////////
    const random100 = random(1, 100);
    let race: Race | null = null;
    let racevariant: Racevariant | null = null;
    if (
      primaryRacePercentage &&
      primaryRaceId &&
      random100 <= primaryRacePercentage
    ) {
      race = (await getRace(id, primaryRaceId)).object as Race;
      racevariant = primaryRacevariantId
        ? ((await getRacevariant(id, primaryRacevariantId))
          .object as Racevariant)
        : null;
    } else if (
      secondaryRaceId &&
      secondaryRacePercentage &&
      random100 <= secondaryRacePercentage
    ) {
      race = (await getRace(id, secondaryRaceId)).object as Race;
      racevariant = secondaryRacevariantId
        ? ((await getRacevariant(id, secondaryRacevariantId))
          .object as Racevariant)
        : null;
    } else {
      const result = await getRandomRace(id);
      race = result.object as Race;
      racevariant =
        ((await getRandomRacevariant(id, result.id))?.object as Racevariant) ||
        null;
    }
    ///////////////////////////////////////
    // A G E   &   H E I G H T   &   W E I G H T
    ///////////////////////////////////////
    
    ///////////////////////////////////////
    // C L A S S   &   P R O F E S S I O N
    ///////////////////////////////////////
    let classChosen: Class | null = null;
    let classvariant: Classvariant | null = null;
    let background: Background | null = null;
    const random20 = classType === 'randomSometimes' ? random(1, 20) : 0;
    if (classId && classType === 'specific') {
      classChosen = (await getClass(id, classId)).object as Class;
      classvariant = classvariantId
        ? ((await getClassvariant(id, classvariantId)).object as Classvariant)
        : null;
    } else if (classType === 'randomAlways' || random20 === 20) {
      const result = await getRandomClass(id);
      classChosen = result.object as Class;
      classvariant =
        ((await getRandomClassvariant(id, result.id))
          ?.object as Classvariant) || null;
    }
    if (backgroundType === 'random') {
      background = (await getRandomBackground(id)).object as Background;
    } else if (backgroundId && backgroundType === 'specific') {
      background = (await getBackground(id, backgroundId)).object as Background;
    }
    ///////////////////////////////////////
    // L E V E L
    ///////////////////////////////////////
    const level = calculateLevel(levelType);
    ///////////////////////////////////////
    // B A C K G R O U N D   F E A T U R E S
    ///////////////////////////////////////
    const pronouns = calculatePronouns(race, racevariant);
    const name = await calculateName(pronouns, race);
    const surname = await calculateSurname(pronouns, race);
    const favouriteSkill = (await getRandomSkill()).name;
    const traitObject = await getRandomTrait({ feeling: 0 });
    const feelingObject = await getRandomTrait({ feeling: 1 });
    const alignmentModifiers = calculateAlignment(traitObject.category);
    const characterHook = await calculateCharacterhook();
    const result: Character = {
      character: {
        name,
        ...(surname !== undefined && { surname }),
        pronouns,
        trait: traitObject.name,
        feeling: feelingObject.name,
        alignmentModifiers,
        characterHook,
      },
    };

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

    return {
      npc: {
        character: character,
      },
    };
  } catch (error) {
    console.warn(error);
    return handleError(error, reply);
  }
}

// function fixPronouns(text: string, pronouns: string) {
//   let result = text;
//   if (pronouns === "male") {
//     result = result.replaceAll("§", "he");
//     result = result.replaceAll("@", "his");
//     result = result.replaceAll("#", "him");
//   } else if (pronouns === "female") {
//     result = result.replaceAll("§", "she");
//     result = result.replaceAll("@", "her");
//     result = result.replaceAll("#", "her");
//   } else if (pronouns === "neutral") {
//     result = result.replaceAll("§", "they");
//     result = result.replaceAll("@", "their");
//     result = result.replaceAll("#", "them");
//   } else {
//     result = result.replaceAll("§", "it");
//     result = result.replaceAll("@", "its");
//     result = result.replaceAll("#", "it");
//   }
//   return result;
// }

async function calculateCharacterhook() {
  return (await getRandomCharacterhook()).hook;
}

function calculateAlignment(
  traitCategory: string
): [[number, number, number], [number, number, number]] {
  let lawfulness = 0;
  let chaoticness = 0;
  let ethicalNeutrality = 0;
  let goodness = 0;
  let evilness = 0;
  let moralNeutrality = 0;

  switch (traitCategory) {
  case 'bad':
    evilness += 0.5;
    chaoticness += 0.5;
    break;
  case 'weird':
    chaoticness += 0.5;
    moralNeutrality += 0.5;
    break;
  case 'evil':
    evilness += 1.0;
    break;
  case 'submissive':
    lawfulness += 0.5;
    break;
  case 'successful':
    lawfulness += 0.5;
    break;
  case 'strong':
    break;
  case 'weak':
    break;
  case 'good':
    goodness = goodness + 1.0;
    break;
  case 'traumatized':
    goodness = goodness + 0.5;
    break;
  case 'intelligent':
    moralNeutrality += 0.25;
    ethicalNeutrality += 0.25;
    break;
  case 'stupid':
    break;
  case 'seductive':
    chaoticness += 0.5;
    break;
  case 'lawful':
    lawfulness = lawfulness + 1.0;
    break;
  case 'chaotic':
    chaoticness = chaoticness + 1.0;
    break;
  default:
    break;
  }

  return [
    [lawfulness, chaoticness, ethicalNeutrality],
    [goodness, evilness, moralNeutrality],
  ];
}

function calculateName(pronouns: string, race: Race | null) {
  let nameType = 'human';
  if (race && race.nameType && race.nameType.length) {
    const randomIndex = random(0, race.nameType.length - 1);
    nameType = race.nameType[randomIndex];
  }
  let gender = pronouns;
  if (gender === 'neutral') {
    gender = random(1, 2) === 1 ? 'male' : 'female';
  }
  return getRandomName({ race: nameType, gender });
}

function calculateSurname(pronouns: string, race: Race | null) {
  let surnameType = 'human';
  if (!race || !race.addSurname || random(1, 100) >= race.addSurname) {
    return undefined;
  }
  if (race && race.nameType && race.nameType.length) {
    const randomIndex = random(0, race.nameType.length - 1);
    surnameType = race.nameType[randomIndex];
  }
  let gender = pronouns;
  if (gender === 'neutral') {
    gender = random(1, 2) === 1 ? 'male' : 'female';
  }
  return getRandomSurname({ race: surnameType, gender });
}

function calculatePronouns(race: Race | null, racevariant: Racevariant | null) {
  if (racevariant && racevariant.pronouns) {
    return racevariant.pronouns;
  } else if (race && race.pronouns) {
    return race.pronouns;
  }
  const random100 = random(1, 100);
  if (random100 <= 2) {
    return 'neutral';
  } else if (random100 <= 51) {
    return 'male';
  } else {
    return 'female';
  }
}

function calculateLevel(levelType = 'random') {
  switch (levelType) {
  case 'randomPeasantsMostly': {
    const randomValue = Math.floor(30 / (Math.random() * 150 + 1) + 1);
    return randomValue > 20 ? 20 : randomValue;
  }
  default:
    return Math.floor(Math.random() * 20 + 1);
  }
}
