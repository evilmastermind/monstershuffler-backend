// @ts-nocheck 
import { FastifyReply, FastifyRequest } from 'fastify';
import { countObjects, getFirstObjectId, getObjectsWithPagination, saveObject,getSpellIdFromName, getIdsFromNames, getActionDetails } from './converter.service';
import { handleError } from '@/utils/errors';
import { objects } from '@prisma/client';
import { z } from 'zod';

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
//      5 | profession
//    101 | action
//    102 | spell
//   1001 | weapon
//   1002 | armor
//  10002 | racevariant
//  10003 | classvariant
//
///////////////////////////////////

/* TODO 2023/03/05: 
- race, racevariant, class, etc. (including weapons, spells, armor, etc.) must
  be converted to the new format (enums, numbers, etc) inside their schema.ts
    V conver enums to numbers
    V convert strings to numbers
    V rename gender to pronouns
    V add a levelMin to (skills, savingThrows, bonuses, languages, etc.)

V check in schemas.ts if all fields have been fixed
- continue filling convertObject(...) with all missing types
- test
- ???
- profit
*/


export async function convertObjectsHandler(request, reply) {
  const { id } = request.user;
  try {
    let cursor = await getFirstObjectId();
    const pageSize = 100;
    const totalObjects = await countObjects();
    let objectsProcessed = 0;
    while (objectsProcessed < (totalObjects - 1)) {
      const objects = await getObjectsWithPagination(id, cursor, pageSize );
      objectsProcessed += objects.length;
      cursor = objects[objects.length - 1]?.id;
      for (const object of objects) {
        await convertObject(object);
        await saveObject(object);
      }
    }
    return reply.code(200).send('OK');
  } catch (error) {
    console.warn(error);
    return handleError(error, reply);
  }
}

async function convertObject(object) {
  const objectJSON = object.object;

  if (!objectJSON || typeof objectJSON !== 'object')
  {
    return;
  }

  switch (object.type) {
  case 1:
    await convertCharacter(objectJSON, object.id);
    break;
  case 2:
  case 3:
  case 4:
  case 5:
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
    // convertWeapon(object);
    break;
  case 1002:
    // convertArmor(object);
    break;
  default:
    break;
  }
}

async function convertNonCharacter(object, id) {
  await convertCharacterObject(object, id);
}

async function convertCharacter(object, id) {
  if (Object.hasOwn(object, 'user')) {
    await convertCharacterObject(object.user, id);
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
  if (Object.hasOwn(object, 'profession')) {
    await convertCharacterObject(object.profession, id);
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
    object.enableGenerator = booleanEnumToBoolean(object['enableGenerator'] || '0');
  }
  // deleting unused fields
  if (Object.hasOwn(object, 'published')) {
    delete object.published;
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
    for(const armor of object.armor) {
      if (Object.hasOwn(armor, 'choice')) {
        await convertChoiceRandom(armor, 'armor');
      }
      newArray.push(armor);
    }
    // armor is now an object
    object.armor = newArray[0];
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
    for(const action of object.actions) {
      newArray.push( await convertAction(action, id));
    }
    object.actions = newArray;
  }
  // spells ids
  if (Object.hasOwn(object, 'spellSlots')) {
    object.spellSlots = await addIdsToSpells(object.spellSlots );
    // spells object
    object.spells = {
      hasSlots: false,
      ability: object?.spellcasting || 'CHA',
      groups: object.spellSlots
    };
    delete object.spellSlots;
  }
  if (Object.hasOwn(object, 'spellcasting')) {
    delete object.spellcasting;
  }
  // alignment
  if (Object.hasOwn(object, 'alignment')) {
    object.alignment = convertAlignment(object.alignment);
  }

  //nameType (for races)
  if (Object.hasOwn(object, 'nameType')) {
    const nameType = object.nameType;
    delete object.nameType;
    object.nameType = [typeof nameType === 'string' ? nameType : nameType.toString()];
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
    delete object.bonuses;
    object.bonuses = bonuses;
  }
}

function convertAlignment(alignment) {
  const alignmentInt = alignment.map(string => parseFloat(string));
  alignmentInt.push(0);
  return alignmentInt;
}

async function addIdsToSpells(spellSlots) {
  for (const spellSlot of spellSlots) {
    if(Object.hasOwn(spellSlot, 'spells') && Array.isArray(spellSlot.spells)) {
      const newArray = [];
      for( const spell of spellSlot.spells) {
        const id = await getSpellIdFromName(spell);
        newArray.push({
          id,
          value: spell
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
    object.subtypes?.forEach(string => {
      newArray.push(convertStatToStatObject(string));
    });
    object.subtypes = newArray;
  }
  // savingThrows
  if (Object.hasOwn(object, 'savingThrows')) {
    const newArray = [];
    object.savingThrows?.forEach(string => {
      newArray.push(convertStatToStatObject(string));
    });
    object.savingThrows = newArray;
  }
  // skills
  if (Object.hasOwn(object, 'skills') && Array.isArray(object.skills)) {
    const newArray = [];
    object.skills?.forEach(string => {
      newArray.push(convertStatToStatObject(string));
    });
    object.skills = newArray;
  }
  // resistances
  if (Object.hasOwn(object, 'resistances')) {
    const newArray = [];
    object.resistances?.forEach(string => {
      newArray.push(convertStatToStatObject(string));
    });
    object.resistances = newArray;
  }
  // immunities
  if (Object.hasOwn(object, 'immunities')) {
    const newArray = [];
    object.immunities?.forEach(string => {
      newArray.push(convertStatToStatObject(string));
    });
    object.immunities = newArray;
  }
  // vulnerabilities
  if (Object.hasOwn(object, 'vulnerabilities')) {
    const newArray = [];
    object.vulnerabilities?.forEach(string => {
      newArray.push(convertStatToStatObject(string));
    });
    object.vulnerabilities = newArray;
  }
  // conditionImmunities
  if (Object.hasOwn(object, 'conditionImmunities')) {
    const newArray = [];
    object.conditionImmunities?.forEach(string => {
      newArray.push(convertStatToStatObject(string));
    });
    object.conditionImmunities = newArray;
  }
  // languages
  if (Object.hasOwn(object, 'languages') && Array.isArray(object.languages)) {
    const newArray = [];
    object.languages?.forEach(string => {
      newArray.push(convertStatToStatObject(string));
    });
    object.languages = newArray;
  }
}

function convertStatToStatObject(string) {
  return {
    value: string,
    levelMin: '1',
  };
}


async function convertAction(object, id) {
  // if the object has been converted already, skip it
  if( Object.hasOwn(object, 'variants')) { 
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
  if (Object.hasOwn(object, 'actionType')) {
    action.actionType = object.actionType;
    delete object.actionType;
  }
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

  // levelMin, levelMax conversion to int
  if (Object.hasOwn(action.variants[0], 'levelMin')) {
    action.variants[0].levelMin = parseInt(action.variants[0].levelMin);
  }
  if (Object.hasOwn(action.variants[0], 'levelMax')) {
    action.variants[0].levelMax = parseInt(action.variants[0].levelMax);
  }

  // profession actions had replaceName erroneously inside the root object instead of the attack object
  if (Object.hasOwn(action.variants[0], 'replaceName')) {
    delete action.variants[0].replaceName;
  }

  // (random actions)
  if (Object.hasOwn(action.variants[0], 'choice')) {
    await convertChoiceRandom(action.variants[0], 'actions');
  }
  if (Object.hasOwn(action.variants[0], 'attacks')) {
    for (const attack of action.variants[0].attacks) {
      // (attacks in actions) replaceName conversion to boolean for Attacks
      attack.replaceName = booleanEnumToBoolean(attack?.replaceName || '0');
      // (attacks in actions) conversion of choiceRandomObject if present
      if (Object.hasOwn(attack.attributes, 'choice')) {
        await convertChoiceRandom(attack.attributes, 'weapons');
      }
    }
  }
  return action;
}

async function convertChoiceRandom(object,source) {
  // filters conversion (keyName, keyValues)
  if (Object.hasOwn(object.choice, 'filtersObject')) {
    const filters = object.choice.filtersObject;
    const newFilters = [];
    for (const key in filters) {
      const newFilter = {};
      newFilter['keyName'] = key;
      if( Array.isArray(filters[key]) ) {
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
      if( Array.isArray(filters[key]) ) {
        newFilter['keyValues'] = filters[key];
      } else {
        newFilter['keyValues'] = [filters[key]];
      }
      newFilters.push(newFilter);
    }
    object.choice.filters = newFilters;
  }

  if (Object.hasOwn(object.choice, 'result')) {
    object.choice.resultType = object.choice.result === 'object' || object.choice?.field === 'object' ? 'object' : 'nameId';
    delete object.choice.result;
  }

  delete object.choice.field;

  if (object.choice.type === 'random') {
    switch (source) {
    case 'actions':
      object.choice.source = 'objects';
      object.choice.objectType = 101;
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
    const newChosenAlready = await getIdsFromNames(object.choice.chosenAlready,source);
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

function booleanEnumToBoolean(value) {
  return value === '1';
}
