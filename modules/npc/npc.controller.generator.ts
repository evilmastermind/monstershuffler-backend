import { PostRandomNpcBody } from './npc.schema';
import { FastifyReply, FastifyRequest } from 'fastify';
import { getRace, getRandomRace } from '@/modules/race/race.service';
import {
  getRacevariant,
  getRandomRacevariant,
} from '@/modules/racevariant/racevariant.service';
import type { Character, Race, Racevariant, Class, Classvariant, Age, Weight, Voice, Background } from '@/types';
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
import { sGetRandomName } from '@/modules/name/name.service';
import { sGetRandomSurname } from '@/modules/surname/surname.service';
import { sGetRandomTraitBodyForAge } from '@/modules/trait/trait.service';
import { getRandomCharacterhookForAge } from '@/modules/characterhook/characterhook.service';
import { handleError } from '@/utils/errors';
import { random, randomDecimal, round2Decimals } from '@/utils/functions';
import { findChoices } from '@/modules/choiceSolver';
import { sGetRandomVoice } from '../voices/voice.service';
import { adjustLevel, createStats, createUserObjectIfNotExists } from 'monstershuffler-shared';

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
    addVoice,
    includeChildren,
    includeBodyType,
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
    const characterHook = await getRandomCharacterhookForAge(age.string);
    const height = race? calculateHeight(race, age) : 0;
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
        ...(traitObject !== null && { trait: traitObject.name }),
        ...(feelingObject !== null && { feeling: feelingObject.name }),
        ...(characterHook !== null && { characterHook: characterHook.hook }),
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

    adjustLevel(result);
    createStats(result);

    console.log(result.character);

    return {
      npc: result,
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

function calculateAge(race: Race, includeChildren = false): Age {
  const ageAdult = race.ageAdult || 0;
  const ageMax = race.ageMax || 0;
  const age: Age = {
    string: 'adult',
    number: random(18,120),
  };
  if (!ageMax && !ageAdult) {
    //
  } else if (!ageMax) {
    const childLimit = ageAdult*0.22;
    if (includeChildren) {
      age.number = Math.ceil(randomDecimal(childLimit, ageAdult*7));
    } else {
      age.number = Math.ceil(randomDecimal(ageAdult, ageAdult*7, 'beginning'));
    }
    if (age.number < childLimit) {
      age.string = 'child';
    } else if (age.number < ageAdult) {
      age.string = 'adolescent';
    } else {
      age.string = 'adult';
    }
  } else {
    const childLimit = ageAdult*0.72; // 1-12 for humans
    const yearsAsGrownUp = ageMax - ageAdult; // 18-90+ for humans
    const youngAdultLimit = ageAdult + yearsAsGrownUp*0.1; // 18-24 for humans
    const adultLimit = ageAdult + yearsAsGrownUp*0.36; // 25-44 for humans
    const middleAgedLimit = ageAdult + yearsAsGrownUp*0.66; // 45-64 for humans
    const elderlyLimit = ageAdult + yearsAsGrownUp*0.94; // 65-85 for humans
    if (includeChildren) {
      age.number = Math.ceil(randomDecimal(childLimit/3, ageMax*1.15));
    } else {
      age.number = Math.ceil(randomDecimal(ageAdult, ageMax*1.15, 'beginning'));
    }
    if (age.number < childLimit) {
      age.string = 'child';
    } else if (age.number < ageAdult) {
      age.string = 'adolescent';
    } else if (age.number < youngAdultLimit) {
      age.string = 'young adult';
    } else if (age.number < adultLimit) {
      age.string = 'adult';
    } else if (age.number < middleAgedLimit) {
      age.string = 'middle-aged';
    } else if (age.number < elderlyLimit) {
      age.string = 'elderly';
    } else {
      age.string = 'venerable';
    }
  }
  return age;
}

function calculateHeight(race: Race, age: Age) {
  let heightMin = race.heightMin || race.heightMax || 0;
  let heightMax = race.heightMax || race.heightMin || 0;
  let height = 6;
  if (!heightMin && !heightMax) {
    const variation = randomDecimal(0.8, 1.2, 'end'); 
    if (race.size === 1) {
      height = 1.75 * variation;
    } else if (race.size === 2) {
      height = 3 * variation;
    } else if (!race.size || race.size === 3) {
      height = 6 * variation;
    } else if (race.size === 4) {
      height = 11 * variation;
    } else if (race.size === 5) {
      height = 24 * variation;
    } else if (race.size === 6) {
      height = 48 * variation;
    }
  } else {
    if (!heightMin) {
      heightMin = heightMax;
    }
    if (!heightMax) {
      heightMax = heightMin;
    }
    if (heightMin > heightMax) {
      const temp = heightMin;
      heightMin = heightMax;
      heightMax = temp;
    }
    if (heightMin === heightMax) {
      // lower heightMin by 20% and increase heightMax by 20%
      heightMin = heightMin * 0.8;
      heightMax = heightMax * 1.2;
    } else {
      // lower heightMin by 10% and increase heightMax by 10%
      heightMin = heightMin * 0.9;
      heightMax = heightMax * 1.1;
    }
    height = randomDecimal(heightMin, heightMax, 'middle', 3);
    const ageAdult = race.ageAdult || 0;
    if((ageAdult && age.number < ageAdult) || age.string === 'child') {
      // adolescents reach max height at around 15 years old 
      const ageMaxHeight = (ageAdult / 6) * 5;
      if (age.number < ageMaxHeight) {
        height = (height / 4) + (height / 4) * 3  * (age.number/ageAdult);
      }
    }
  }
  return round2Decimals(height);
}

function calculateWeight(): Weight {
  const randomValue = random(1, 20);
  if (randomValue <= 14) {
    return 'average';
  }
  else if(randomValue <= 19 ) {
    const weightTypes: Weight[] = ['skinny', 'chubby'];
    return weightTypes[random(0,1)];
  }
  return 'obese';
}

function calculateAlignment(
  traitCategory: string | undefined
): [[number, number, number], [number, number, number]] {
  let lawfulness = 0;
  let ethicalNeutrality = 0;
  let chaoticness = 0;
  let goodness = 0;
  let moralNeutrality = 0;
  let evilness = 0;

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
    [lawfulness, ethicalNeutrality, chaoticness],
    [goodness, moralNeutrality, evilness],
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
  return sGetRandomName({ race: nameType, gender });
}

async function calculateSurname(pronouns: string, race: Race | null) {
  let surnameType = 'human';
  if (!race || !race.addSurname || random(1, 100) >= race.addSurname) {
    return null;
  }
  if (race && race.nameType && race.nameType.length) {
    const randomIndex = random(0, race.nameType.length - 1);
    surnameType = race.nameType[randomIndex];
  }
  let gender = pronouns;
  if (gender === 'neutral') {
    gender = random(1, 2) === 1 ? 'male' : 'female';
  }
  return await sGetRandomSurname({ race: surnameType, gender });
}

function calculatePronouns(race: Race | null, racevariant: Racevariant | null) {
  if (racevariant && racevariant.pronouns) {
    return racevariant.pronouns;
  } else if (race && race.pronouns) {
    return race.pronouns;
  }
  const random100 = random(1, 100);
  if (random100 <= 3) {
    return 'neutral';
  } else if (random100 <= 51) {
    return 'male';
  } else {
    return 'female';
  }
}

async function calculateVoice(pronouns: string) {
  let options;
  if (['male','female'].includes(pronouns)) {
    options = { gender: pronouns };
  } else {
    options = {};
  }
  const randomVoice = await sGetRandomVoice(options);
  if(!randomVoice) {
    return null;
  }
  const newVoice: Voice = {
    person: randomVoice.person,
    filename: randomVoice.filename,
  };
  if (randomVoice.character) {
    newVoice.character = randomVoice.character;
  }
  if (randomVoice.production) {
    newVoice.production = randomVoice.production;
  }
  return newVoice;
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
