import type {Voice, Race, Racevariant, Weight, Age,  } from '@/types';
import { sGetRandomVoice } from '../voices/voice.service';
import { sGetRandomSurname } from '@/modules/surname/surname.service';
import { sGetRandomName } from '@/modules/name/name.service';
import { random, randomDecimal, round2Decimals } from '@/utils/functions';

export async function calculateVoice(pronouns: string) {
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

export function calculatePronouns(race: Race | null, racevariant: Racevariant | null) {
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

export async function calculateName(pronouns: string, race: Race | null) {
  let nameType = 'human';
  if (race && race.nameType && race.nameType.length) {
    const randomIndex = random(0, race.nameType.length - 1);
    nameType = race.nameType[randomIndex];
  }
  let gender = pronouns;
  if (gender === 'neutral') {
    gender = random(1, 2) === 1 ? 'male' : 'female';
  }
  return await sGetRandomName({ race: nameType, gender });
}



export async function calculateSurname(pronouns: string, race: Race | null) {
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

export function calculateAlignment(
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


export function calculateWeight(): Weight {
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

export function calculateHeight(race: Race, age: Age, pronouns: string): number {
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
  if (pronouns === 'female') {
    // "For most human populations, men are on average about eight percent taller than women"
    height = height * 0.926;
  }
  return round2Decimals(height);
}

export function calculateAge(race: Race, includeChildren = false): Age {
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
