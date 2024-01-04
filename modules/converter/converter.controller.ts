// @ts-nocheck
import {
  countObjects,
  getFirstObjectId,
  getObjectsWithPagination,
  saveObject,
  getSpellIdFromName,
  getIdsFromNames,
  convertBackgroundPronouns,
} from './converter.service';
import { handleError } from '@/utils/errors';
import prisma from '@/utils/prisma';

///////////////////////////////////
// O B J E C T   T Y P E S
///////////////////////////////////
//
//  type  |     name
// -------+------------------------
//      1 | character
//      2 | race
//      3 | class
//      4 | template
//      5 | background
//    101 | action
//    102 | spell
//   1001 | weapon
//   1002 | armor
//  10002 | racevariant
//  10003 | classvariant
//
///////////////////////////////////

export async function convertObjectsHandler(request, reply) {
  const { id } = request.user;
  try {
    await prisma.$queryRaw`ALTER TABLE objects ALTER COLUMN object TYPE JSONB USING object::JSONB;`;
    await prisma.$queryRaw`ALTER TABLE characterhooks ALTER COLUMN object TYPE JSONB USING object::JSONB;`;
    await prisma.$queryRaw`ALTER TABLE traits ALTER COLUMN object TYPE JSONB USING object::JSONB;`;
    await prisma.$queryRaw`ALTER TABLE users ALTER COLUMN settings TYPE JSONB USING settings::JSONB;`;
    await prisma.$queryRaw`CREATE INDEX idx_gin_characterhooks ON characterhooks USING GIN(object);`;
    await prisma.$queryRaw`CREATE INDEX idx_gin_traits ON traits USING GIN(object);`;

    // OBJECTS
    let cursor = await getFirstObjectId();
    const pageSize = 100;
    const totalObjects = await countObjects();
    let objectsProcessed = 0;
    while (objectsProcessed < totalObjects - 1) {
      const objects = await getObjectsWithPagination(id, cursor, pageSize);
      objectsProcessed += objects.length;
      cursor = objects[objects.length - 1]?.id;
      for (const object of objects) {
        await convertObject(object);
        await saveObject(object);
      }
    }
    // BACKGROUNDS
    await convertBackgroundPronouns();
    return reply.code(200).send('OK');
  } catch (error) {
    console.warn(error);
    return handleError(error, reply);
  }
}

async function convertObject(object) {
  const objectJSON = object.object;

  if (!objectJSON || typeof objectJSON !== 'object') {
    return;
  }

  switch (object.type) {
  case 1:
    await convertCharacter(objectJSON, object.id);
    break;
  case 2:
  case 3:
  case 4:
    await convertNonCharacter(objectJSON, object.id);
    break;
  case 5:
    addCompatibleAgesToBackground(objectJSON);
    await convertNonCharacter(objectJSON, object.id);
    break;
  case 10002:
  case 10003:
    await convertNonCharacter(objectJSON, object.id);
    break;
  case 101:
    object.object = await convertAction(objectJSON, object.id);
    break;
  case 102:
    // convertSpell(object);
    break;
  case 1001:
    convertWeapon(object);
    break;
  case 1002:
    object.object = await convertArmor(objectJSON);
    break;
  default:
    break;
  }
}

async function convertNonCharacter(object, id) {
  await convertCharacterObject(object, id);
}

async function convertCharacter(object, id) {
  renameStuff(object);
  convertAbilityScores(object);
  if (Object.hasOwn(object, 'user')) {
    await convertCharacterObject(object.user, id);
    // proficiencyCalculation moved to .character
    if (Object.hasOwn(object.user, 'proficiencyCalculation')) {
      object.proficiencyCalculation =
        object.user.proficiencyCalculation === 'cr' ? 'CR' : 'level';
      delete object.user.proficiencyCalculation;
    }
  }
  if (Object.hasOwn(object, 'race')) {
    await convertCharacterObject(object.race, id);
  }
  if (Object.hasOwn(object, 'racevariant')) {
    await convertCharacterObject(object.racevariant, id);
  }
  if (Object.hasOwn(object, 'class')) {
    await convertCharacterObject(object.class, id);
  }
  if (Object.hasOwn(object, 'classvariant')) {
    await convertCharacterObject(object.classvariant, id);
  }
  if (Object.hasOwn(object, 'template')) {
    await convertCharacterObject(object.template, id);
  }
  if (Object.hasOwn(object, 'background')) {
    await convertCharacterObject(object.background, id);
    addCompatibleAgesToBackground(object.background);
  }
}

function addCompatibleAgesToBackground(background) {
  background.compatibleAges = [
    'child',
    'adolescent',
    'young adult',
    'adult',
    'middle-aged',
    'elderly',
    'venerable',
  ];
}

function renameStuff(object) {
  // background => backstory
  if (Object.hasOwn(object, 'background')) {
    object.backstory = object.background;
    delete object.background;
  }
  // backgroundImage => imageBackground
  if (Object.hasOwn(object, 'backgroundImage')) {
    object.imageBackground = object.backgroundImage;
    delete object.backgroundImage;
  }
  // profession => background
  if (Object.hasOwn(object, 'profession')) {
    object.background = object.profession;
    delete object.profession;
  }
  // smallbackground => characterHook
  if (Object.hasOwn(object, 'smallbackground')) {
    object.characterHook = object.smallbackground;
    delete object.smallbackground;
  }
}

async function convertCharacterObject(object, id) {
  addStatObjects(object);
  // enums
  if (Object.hasOwn(object, 'swarm')) {
    object.isSwarm = booleanEnumToBoolean(object['swarm'] || '0');
    delete object.swarm;
  }
  if (Object.hasOwn(object, 'blind')) {
    object.isBlind = booleanEnumToBoolean(object['blind'] || '0');
    delete object.blind;
  }
  if (Object.hasOwn(object, 'canspeak')) {
    object.canSpeak = booleanEnumToBoolean(object['canspeak'] || '0');
    delete object.canspeak;
  }
  if (Object.hasOwn(object, 'enableGenerator')) {
    object.enableGenerator = booleanEnumToBoolean(
      object['enableGenerator'] || '0'
    );
  }

  // age and height for races
  convertAgeAndHeight(object);

  // deleting unused fields
  if (Object.hasOwn(object, 'published')) {
    delete object.published;
  }

  // size should be a number
  if (Object.hasOwn(object, 'size')) {
    object.size = parseInt(object.size);
  }

  // gender => pronouns
  if (Object.hasOwn(object, 'gender')) {
    object.pronouns = object.gender;
    delete object.gender;
  }
  // swarmSize fix
  if (Object.hasOwn(object, 'swarmSize')) {
    switch (object.swarmSize.toLowerCase()) {
    case 'tiny':
      object.swarmSize = '1';
      break;
    case 'small':
      object.swarmSize = '2';
      break;
    case 'medium':
      object.swarmSize = '3';
      break;
    case 'large':
      object.swarmSize = '4';
      break;
    case 'huge':
      object.swarmSize = '5';
      break;
    case 'gargantuan':
      object.swarmSize = '6';
      break;
    default:
      object.swarmSize = '3';
      break;
    }
  }
  // armor random choice fix
  if (Object.hasOwn(object, 'armor') && Array.isArray(object.armor)) {
    const newArray = [];
    for (const armor of object.armor) {
      if (Object.hasOwn(armor, 'choice')) {
        await convertChoiceRandom(armor, 'armor');
      }
      // replacing stealthDis (string to boolean)
      if (Object.hasOwn(armor, 'stealthDis')) {
        armor.stealthDis = booleanEnumToBoolean(armor.stealthDis);
      }
      newArray.push(armor);
    }
    // armor is now an object
    object.armor = newArray[0];
  }

  convertAbilityScores(object);

  if (Object.hasOwn(object, 'speeds')) {
    if (Object.hasOwn(object.speeds, 'base')) {
      object.speeds.walk = object.speeds.base;
      delete object.speeds.base;
    }
  }

  // abilitiesLimit should be numeric, not strings
  if (Object.hasOwn(object, 'abilitiesLimit')) {
    object.abilityScoresLimit = parseInt(object.abilitiesLimit);
    delete object.abilitiesLimit;
  }

  // skills random choice fix
  if (
    Object.hasOwn(object, 'skills') &&
    typeof object.skills === 'object' &&
    Object.hasOwn(object.skills, 'choice')
  ) {
    await convertChoiceRandom(object.skills, 'skills');
  }

  // languages random choice fix
  if (
    Object.hasOwn(object, 'languages') &&
    typeof object.languages === 'object' &&
    Object.hasOwn(object.languages, 'choice')
  ) {
    await convertChoiceRandom(object.languages, 'languages');
  }
  // actions
  if (Object.hasOwn(object, 'actions')) {
    const newArray = [];
    for (const action of object.actions) {
      newArray.push(await convertAction(action, id));
    }
    object.actions = newArray;
  }
  if (Object.hasOwn(object, 'spellSlots')) {
    // spells ids
    object.spellSlots = await addIdsToSpells(object.spellSlots);
    // spells object
    object.spells = {
      hasSlots: false,
      ability: object?.spellcasting || 'CHA',
      availableUnit: 'level',
      groups: object.spellSlots,
    };
    delete object.spellSlots;
  }
  if (Object.hasOwn(object, 'spellcasting')) {
    delete object.spellcasting;
  }
  // alignment
  if (Object.hasOwn(object, 'alignment')) {
    object.alignmentModifiers = convertAlignment(object.alignment);
    delete object.alignment;
  }

  //nameType (for races)
  if (Object.hasOwn(object, 'nameType')) {
    const nameType = object.nameType;
    delete object.nameType;
    object.nameType = [
      typeof nameType === 'string' ? nameType : nameType.toString(),
    ];
  }
  // bonuses (all values must be strings)
  if (Object.hasOwn(object, 'bonuses')) {
    const bonuses = {};
    for (const [key, value] of Object.entries(object.bonuses)) {
      const bonus = {};
      if (Object.hasOwn(value, 'value')) {
        bonus.value = value.value.toString();
      }
      if (Object.hasOwn(value, 'name')) {
        bonus.name = value.name.toString();
      }
      bonuses[key] = bonus;
    }
    if (Object.hasOwn(bonuses, 'speedBaseBonus')) {
      bonuses.walkBonus = bonuses.speedBaseBonus;
      delete bonuses.speedBaseBonus;
    }
    if (Object.hasOwn(bonuses, 'speedFlyBonus')) {
      bonuses.flyBonus = bonuses.speedFlyBonus;
      delete bonuses.speedFlyBonus;
    }
    if (Object.hasOwn(bonuses, 'speedBurrowBonus')) {
      bonuses.burrowBonus = bonuses.speedBurrowBonus;
      delete bonuses.speedBurrowBonus;
    }
    if (Object.hasOwn(bonuses, 'speedClimbBonus')) {
      bonuses.climbBonus = bonuses.speedClimbBonus;
      delete bonuses.speedClimbBonus;
    }
    if (Object.hasOwn(bonuses, 'speedSwimBonus')) {
      bonuses.swimBonus = bonuses.speedSwimBonus;
      delete bonuses.speedSwimBonus;
    }
    if (Object.hasOwn(bonuses, 'speedHoverBonus')) {
      bonuses.hoverBonus = bonuses.speedHoverBonus;
      delete bonuses.speedHoverBonus;
    }
    delete object.bonuses;
    object.bonuses = bonuses;
  }
}

function convertAbilityScores(object) {
  // abilitiesBase should be numeric, not strings
  if (Object.hasOwn(object, 'abilitiesBase')) {
    object.abilityScores = {};
    for (const [ability, value] of Object.entries(object.abilitiesBase)) {
      object.abilityScores[ability] = parseInt(value);
    }
    delete object.abilitiesBase;
  }
}

function convertAlignment(alignment) {
  const alignmentInt = alignment.map((string) => parseFloat(string));
  // [[lawfulness, ethicalNeutrality, chaoticness], [goodness, moralNeutrality, evilness]]
  const newAligment = [
    [0, 0, 0],
    [0, 0, 0],
  ];
  if (alignmentInt[0] > 0) {
    newAligment[0][0] += alignmentInt[0];
  } else if (alignmentInt[0] < 0) {
    newAligment[0][2] += Math.abs(alignmentInt[0]);
  }
  if (alignmentInt[1] > 0) {
    newAligment[1][0] += alignmentInt[0];
  } else if (alignmentInt[1] < 0) {
    newAligment[1][2] += Math.abs(alignmentInt[0]);
  }
  return newAligment;
}

async function addIdsToSpells(spellSlots) {
  for (const spellSlot of spellSlots) {
    if (Object.hasOwn(spellSlot, 'levelMin')) {
      spellSlot.availableAt = parseInt(spellSlot.levelMin);
      delete spellSlot.levelMin;
    }
    if (Object.hasOwn(spellSlot, 'spells') && Array.isArray(spellSlot.spells)) {
      const newArray = [];
      for (const spell of spellSlot.spells) {
        const id = await getSpellIdFromName(spell);
        newArray.push({
          id,
          value: spell,
        });
      }
      spellSlot.spells = newArray;
    } else if (
      Object.hasOwn(spellSlot, 'spells') &&
      typeof spellSlot.spells === 'object' &&
      Object.hasOwn(spellSlot.spells, 'choice')
    ) {
      // replace chosenAlready
      // fix random choice
      await convertChoiceRandom(spellSlot.spells, 'spells');
    }
  }
  return spellSlots;
}

function addStatObjects(object) {
  // subtypes
  if (Object.hasOwn(object, 'subtypes')) {
    const newArray = [];
    object.subtypes?.forEach((string) => {
      newArray.push(convertStatToStatObject(string));
    });
    object.subtypes = newArray;
  }
  // savingThrows
  if (Object.hasOwn(object, 'savingThrows')) {
    const newArray = [];
    object.savingThrows?.forEach((string) => {
      newArray.push(convertStatToStatObject(string));
    });
    object.savingThrows = newArray;
  }
  // skills
  if (Object.hasOwn(object, 'skills') && Array.isArray(object.skills)) {
    const newArray = [];
    object.skills?.forEach((string) => {
      newArray.push(convertStatToStatObject(string));
    });
    object.skills = newArray;
  }
  // resistances
  if (Object.hasOwn(object, 'resistances')) {
    const newArray = [];
    object.resistances?.forEach((string) => {
      newArray.push(convertStatToStatObject(string));
    });
    object.resistances = newArray;
  }
  // immunities
  if (Object.hasOwn(object, 'immunities')) {
    const newArray = [];
    object.immunities?.forEach((string) => {
      newArray.push(convertStatToStatObject(string));
    });
    object.immunities = newArray;
  }
  // vulnerabilities
  if (Object.hasOwn(object, 'vulnerabilities')) {
    const newArray = [];
    object.vulnerabilities?.forEach((string) => {
      newArray.push(convertStatToStatObject(string));
    });
    object.vulnerabilities = newArray;
  }
  // conditionImmunities
  if (Object.hasOwn(object, 'conditionImmunities')) {
    const newArray = [];
    object.conditionImmunities?.forEach((string) => {
      newArray.push(convertStatToStatObject(string));
    });
    object.conditionImmunities = newArray;
  }
  // languages
  if (Object.hasOwn(object, 'languages') && Array.isArray(object.languages)) {
    const newArray = [];
    object.languages?.forEach((string) => {
      newArray.push(convertStatToStatObject(string));
    });
    object.languages = newArray;
  }
}

function convertStatToStatObject(string) {
  return {
    value: string,
    availableAt: 1,
  };
}

async function convertAction(object, id) {
  // if the object has been converted already, skip it
  if (Object.hasOwn(object, 'variants')) {
    return object;
  }

  if(Object.hasOwn(object, 'recharge')) {
    switch (object.recharge) {
    case '3–6':
      object.recharge = '3-6';
      break;
    case '4–6':
      object.recharge = '4-6';
      break;
    case '5–6':
      object.recharge = '5-6';
      break;
    case '6–6':
      object.recharge = '6-6';
      break;
    }
  }

  // (random actions)
  if (Object.hasOwn(object, 'choice')) {
    await convertChoiceRandom(object, 'actions');
    return object;
  }

  const action = {
    tag: object?.tag || object?.name || 'action',
  };

  delete object.tag;

  if (Object.hasOwn(object, 'priority')) {
    action.priority = parseInt(object.priority);
    delete object.priority;
  }
  // this actionType here is used to search for actions if they have been published
  if (Object.hasOwn(object, 'actionType')) {
    action.actionType = object.actionType;
    delete object.actionType;
  }
  // same for the 3 follwing keys
  if (Object.hasOwn(object, 'subType')) {
    action.subType = object.subType;
    delete object.subType;
  }
  if (Object.hasOwn(object, 'source')) {
    action.source = object.source;
    delete object.source;
  }
  if (Object.hasOwn(object, 'tags')) {
    action.tags = object.tags;
    delete object.tags;
  }

  action.variants = [{ ...object }];

  // levelMin/levelMax to availableAt/availableUntil/availableUnit
  action.availableUnit = 'level';
  if (
    Object.hasOwn(action.variants[0], 'levelMin') &&
    action.variants[0].levelMin
  ) {
    action.variants[0].availableAt = parseInt(action.variants[0].levelMin);
    delete action.variants[0].levelMin;
  }
  if (
    Object.hasOwn(action.variants[0], 'levelMax') &&
    action.variants[0].levelMax
  ) {
    action.availableUntil = parseInt(action.variants[0].levelMax);
    delete action.variants[0].levelMax;
  }

  // profession actions had replaceName erroneously inside the root object instead of the attack object
  if (Object.hasOwn(action.variants[0], 'replaceName')) {
    delete action.variants[0].replaceName;
  }

  if (Object.hasOwn(action.variants[0], 'attacks')) {
    for (const attack of action.variants[0].attacks) {
      // (attacks in actions) replaceName conversion to boolean for Attacks
      attack.replaceName = booleanEnumToBoolean(attack?.replaceName || '0');
      // (attacks in actions) conversion of choiceRandomObject if present
      if (Object.hasOwn(attack.attributes, 'choice')) {
        await convertChoiceRandom(attack.attributes, 'weapons');
      }
      // enchantment diceObject => levelMin/levelMax to availableAt/availableUntil/availableUnit
      if (Object.hasOwn(attack, 'enchantment')) {
        if (Object.hasOwn(attack.enchantment, 'dice')) {
          convertDiceObject(attack.enchantment.dice);
        }
      }
    }
  }
  // values diceObject => levelMin/levelMax to availableAt/availableUntil/availableUnit
  if (Object.hasOwn(action.variants[0], 'values')) {
    action.variants[0].values.forEach((value) => {
      if (Object.hasOwn(value, 'dice')) {
        convertDiceObject(value.dice);
      }
      if (Object.hasOwn(value, 'incrProgression')) {
        value.incrProgression.unitInterval = parseInt(
          value.incrProgression.levelInterval
        );
        delete value.incrProgression.levelInterval;
        value.incrProgression.unitIncrement = parseInt(
          value.incrProgression.levelIncrement
        );
        delete value.incrProgression.levelIncrement;
        replaceLevelWithAvailable(value.incrProgression);
        value.incrProgression.valueBase = parseInt(value.incrProgression.base);
        delete value.incrProgression.base;
        value.incrProgression.valueIncrement = parseInt(
          value.incrProgression.increment
        );
        delete value.incrProgression.increment;
      }
    });
  }
  return action;
}

function convertDiceObject(object) {
  replaceLevelWithAvailable(object);
  stringToNumber(object, 'die');
  stringToNumber(object, 'diceNumber');
  stringToNumber(object, 'diceIncrement');
  // die => sides and diceNumber => dice
  if (Object.hasOwn(object, 'die')) {
    object.sides = object.die;
    delete object.die;
  }
  if (Object.hasOwn(object, 'diceNumber')) {
    object.dice = object.diceNumber;
    delete object.diceNumber;
  }
  if (Object.hasOwn(object, 'levelInterval')) {
    if (
      object.levelInterval !== null &&
      object.levelInterval !== undefined &&
      object.levelInterval !== ''
    ) {
      object.unitInterval = parseInt(object.levelInterval);
    }
    delete object.levelInterval;
  }
}

function replaceLevelWithAvailable(object) {
  if (Object.hasOwn(object, 'levelMin')) {
    if (
      object.levelMin !== null &&
      object.levelMin !== undefined &&
      object.levelMin !== ''
    ) {
      object.availableUnit = 'level';
      object.availableAt = parseInt(object.levelMin);
    }
    delete object.levelMin;
  }
  if (Object.hasOwn(object, 'levelMax')) {
    if (
      object.levelMax !== null &&
      object.levelMax !== undefined &&
      object.levelMax !== ''
    ) {
      object.availableUnit = 'level';
      object.availableUntil = parseInt(object.levelMax);
    }
    delete object.levelMax;
  }
}

async function convertArmor(object) {
  // stealthDis conversion to boolean
  if (Object.hasOwn(object, 'stealthDis')) {
    object.stealthDis = booleanEnumToBoolean(object.stealthDis);
  }
  return object;
}

async function convertChoiceRandom(object, source) {
  // filters conversion (keyName, keyValues)
  if (Object.hasOwn(object.choice, 'filtersObject')) {
    const filters = object.choice.filtersObject;
    const newFilters = [];
    for (const key in filters) {
      const newFilter = {};
      newFilter['keyName'] = key;
      if (Array.isArray(filters[key])) {
        newFilter['keyValues'] = filters[key];
      } else {
        newFilter['keyValues'] = [filters[key]];
      }
      newFilters.push(newFilter);
    }
    // renaming filtersObject to filters,
    // since each table will now have its own choice solver
    object.choice.filters = newFilters;
    delete object.choice.filtersObject;
  } else if (Object.hasOwn(object.choice, 'filters')) {
    const filters = object.choice.filters;
    const newFilters = [];
    for (const key in filters) {
      const newFilter = {};
      newFilter['keyName'] = key;
      if (Array.isArray(filters[key])) {
        newFilter['keyValues'] = filters[key];
      } else {
        newFilter['keyValues'] = [filters[key]];
      }
      newFilters.push(newFilter);
    }
    object.choice.filters = newFilters;
  }

  if (Object.hasOwn(object.choice, 'result')) {
    object.choice.resultType =
      object.choice.result === 'object' || object.choice?.field === 'object'
        ? 'object'
        : 'nameId';
    delete object.choice.result;
  }

  delete object.choice.field;

  if (object.choice.type === 'random') {
    switch (source) {
    case 'actions':
      object.choice.source = 'objects';
      object.choice.objectType = 101;
      convertProfessionFiltersInActions(object.choice.filters);
      break;
    case 'armor':
      object.choice.source = 'objects';
      object.choice.objectType = 1002;
      break;
    case 'weapons':
      object.choice.source = 'objects';
      object.choice.objectType = 1001;
      break;
    case 'spells':
      object.choice.source = 'objects';
      object.choice.objectType = 102;
      break;
    case 'skills':
    case 'languages':
      object.choice.source = source;
      break;
    }
  } else {
    if (Object.hasOwn(object.choice, 'source')) {
      delete object.choice.source;
    }
    if (Object.hasOwn(object.choice, 'objectType')) {
      delete object.choice.objectType;
    }
  }

  // replacing 'chosenAlready' if present
  if (Object.hasOwn(object.choice, 'chosenAlready')) {
    const newChosenAlready = await getIdsFromNames(
      object.choice.chosenAlready,
      source
    );
    delete object.choice.chosenAlready;
    object.choice.chosenAlready = newChosenAlready;
  }

  // replacing 'list' if present
  if (Object.hasOwn(object.choice, 'list')) {
    const newList = await getIdsFromNames(object.choice.list, source);
    delete object.choice.list;
    object.choice.list = newList;
  }

  // repeatable conversion to boolean
  if (Object.hasOwn(object.choice, 'repeatable')) {
    object.choice.isRepeatable = booleanEnumToBoolean(object.choice.repeatable);
    delete object.choice.repeatable;
  }
  // some fields in choicceRandomObject and choiceListObject must be converted from string to number
  if (Object.hasOwn(object.choice, 'number')) {
    object.choice.number = parseInt(object.choice.number);
  }
}

function convertProfessionFiltersInActions(filters) {
  if (!filters?.length) {
    return;
  }
  for (const filter of filters) {
    switch (filter.keyName) {
    case 'actiontype':
      filter.keyName = 'actionType';
      break;
    case 'subtype':
      filter.keyName = 'subType';
      break;
    }
  }
}

function booleanEnumToBoolean(value) {
  return value === '1';
}

function stringToNumber(object, key) {
  if (Object.hasOwn(object, key)) {
    if (
      object[key] !== null &&
      object[key] !== undefined &&
      object[key] !== ''
    ) {
      object[key] = parseInt(object[key]);
    } else {
      delete object[key];
    }
  }
}

function convertAgeAndHeight(race) {
  if (Object.hasOwn(race, 'ageAdult')) {
    race.ageAdult = parseInt(race.ageAdult);
  }
  if (Object.hasOwn(race, 'ageMax')) {
    race.ageMax = parseInt(race.ageMax);
  }
  if (Object.hasOwn(race, 'heightMin')) {
    race.heightMin = parseInt(race.heightMin);
  }
  if (Object.hasOwn(race, 'heightMax')) {
    race.heightMax = parseInt(race.heightMax);
  }
}

function convertWeapon(object) {
  if (Object.hasOwn(object, 'die')) {
    object.sides = object.die;
    delete object.die;
  }
  if (Object.hasOwn(object, 'diceNumber')) {
    object.dice = object.diceNumber;
    delete object.diceNumber;
  }
  if (Object.hasOwn(object, 'dieV')) {
    object.sidesV = object.dieV;
    delete object.dieV;
  }
  if (Object.hasOwn(object, 'diceNumberV')) {
    object.diceV = object.diceNumberV;
    delete object.diceNumberV;
  }
}
