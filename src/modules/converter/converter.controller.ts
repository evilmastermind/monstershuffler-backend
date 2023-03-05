// @ts-nocheck 
import { FastifyReply, FastifyRequest } from 'fastify';
import { countObjects, getFirstObjectId, getObjectsWithPagination, saveObject,getSpellIdFromName } from './converter.service';
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
- check in schemas.ts if all fields have been fixed
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
      console.log(`${objectsProcessed} of ${totalObjects} objects processed.}`);
      cursor = objects[objects.length - 1]?.id;
      objects.forEach( object => {
        convertObject(object);
        // TODO: saveObject(object);
      });
    }
    return reply.code(200).send('OK');
  } catch (error) {
    return handleError(error, reply);
  }
}

function convertObject(object) {
  const objectJSON = object.object;

  if (!objectJSON || typeof objectJSON !== 'object')
  {
    return;
  }

  switch (object.type) {
  case 1:
    object.object = convertCharacter(objectJSON);
    break;
  case 2:
    convertNonCharacter(objectJSON, object.id);
    break;
  case 3:
    convertNonCharacter(objectJSON, object.id);
    break;
  case 4:
    convertNonCharacter(objectJSON, object.id);
    break;
  case 5:
    convertNonCharacter(objectJSON, object.id);
    break;
  case 101:
    object.object = convertAction(objectJSON, object.id);
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
  case 10002:
    // convertRaceVariant(object);
    break;
  case 10003:
    // convertClassVariant(object);
    break;
  default:
    break;
  }
}

function convertNonCharacter(object, id) {
  convertCharacterObject(object, id);
}

function convertCharacter(object, id) {
  if (Object.hasOwn(object, 'user')) {
    convertCharacterObject(object.user, id);
  }
  if (Object.hasOwn(object, 'race')) {
    convertCharacterObject(object.race, id);
  }
  if (Object.hasOwn(object, 'racevariant')) {
    convertCharacterObject(object.racevariant, id);
  }
  if (Object.hasOwn(object, 'class')) {
    convertCharacterObject(object.class, id);
  }
  if (Object.hasOwn(object, 'classvariant')) {
    convertCharacterObject(object.classvariant, id);
  }
  if (Object.hasOwn(object, 'template')) {
    convertCharacterObject(object.template, id);
  }
  if (Object.hasOwn(object, 'profession')) {
    convertCharacterObject(object.profession, id);
  }
  return object;
}

function convertCharacterObject(object, id) {
  addStatObjects(object);
  fixEnums(object, ['swarm','blind','canspeak']);
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
    object.armor?.forEach(armor => {
      if (Object.hasOwn(armor, 'choice')) {
        convertChoiceRandom(armor.choice, 'armor');
      }
      newArray.push(armor);
    });
    object.armor = newArray;
  }

  // skills random choice fix
  if (
    Object.hasOwn(object, 'skills') && 
      typeof object.languages === 'object' &&  
      Object.hasOwn(object.skills, 'choice')
  ) {
    convertChoiceRandom(object.skills.choice, 'skills');
  }

  // languages random choice fix
  if (
    Object.hasOwn(object, 'languages') && 
    typeof object.languages === 'object' &&  
    Object.hasOwn(object.languages, 'choice')
  ) {
    convertChoiceRandom(object.languages.choice, 'languages');
  }
  // actions
  if (Object.hasOwn(object, 'actions')) {
    const newArray = [];
    object.actions?.forEach(action => {
      newArray.push(convertAction(action, id));
    });
    object.actions = newArray;
  }
  // spells
  if (Object.hasOwn(object, 'spellSlots')) {
    object.spellSlots = addIdsToSpells(object.spellSlots );
  }
}

function addIdsToSpells(spellSlots) {
  spellSlots?.forEach(spellSlot => {
    if(Object.hasOwn(spellSlot, 'spells') && Array.isArray(spellSlot.spells)) {
      const newArray = [];
      spellSlot.spell.forEach(spell => {
        newArray.push({
          id: await getSpellIdFromName(spell),
          name: spell
        });
      });
    } else if (
      Object.hasOwn(spellSlot, 'spells') &&
      typeof spellSlot.spells === 'object' &&  
      Object.hasOwn(spellSlot.spells, 'choice')
    ) {
      // replace chosenAlready
      // fix random choice
      spellSlot.spells.forEach(spell => {
        spell.id = await getSpellIdFromName(spell.name);
      });
    }
  });
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
    object.savingThrows?.forEach(string => {
      newArray.push(convertStatToStatObject(string));
    });
    object.savingThrows = newArray;
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

function fixEnums(object, enums) {
  enums.forEach(enumName => {
    if (Object.hasOwn(object, enumName)) {
      object[enumName] = booleanEnumToBoolean(object[enumName] || '0');
    }
  });
}

function convertStatToStatObject(string) {
  return {
    value: string,
    levelMin: 1,
  };
}


function convertAction(object, id) {
  // if the object has been converted already, skip it
  if( Object.hasOwn(object, 'variants')) { 
    return object; 
  }
  const action = {
    tag: object.tag,
    priority: parseInt(object.priority),
    variants: [{ ...object }]
  };

  delete action.variants[0].tag;
  delete action.variants[0].priority;

  // levelMin, levelMax conversion to int
  if (Object.hasOwn(action.variants[0], 'levelMin')) {
    action.variants[0].levelMin = parseInt(action.variants[0].levelMin);
  }
  if (Object.hasOwn(action.variants[0], 'levelMax')) {
    action.variants[0].levelMax = parseInt(action.variants[0].levelMax);
  }

  // (random actions)
  if (Object.hasOwn(action.variants[0], 'choice')) {
    // replacing filters with filtersObject (now actions are inside Objects)
    if (Object.hasOwn(action.variants[0].choice, 'filters')) {
      action.variants[0].choice.filtersObject = action.variants[0].choice.filters;
      deleteaction.variants[0].choice.filters;
    }
    convertChoiceRandom(attack.attributes.choice, 'actions');
  }
  
  action.variants[0].attacks?.forEach(attack => {
    // (attacks in actions) replaceName conversion to boolean for Attacks
    attack.replaceName = booleanEnumToBoolean(attack?.replaceName || '0');
    // (attacks in actions) conversion of choiceRandomObject if present
    if (Object.hasOwn(attack.attributes, 'choice')) {
      convertChoiceRandom(attack.attributes.choice, 'weapons');
    }
  });

  // retrieving the details of the action
  const actionDetails = await getActionDetails(id);
  action.name = actionDetails.name;
  action.type = actionDetails.actiontype;
  action.subtype = actionDetails.subtype;
  action.source = actionDetails.source;
  action.tags = actionDetails.tags;

  console.log(action);
  return action;
}

function convertChoiceRandom(object,type) {
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
    object.choice.filtersObject = newFilters;
    console.log(object);
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
    console.log(object);
  }


  // replacing 'chosenAlready' if present
  if (Object.hasOwn(object.choice, 'chosenAlready')) {
    object.choice.chosenAlready = getIdsFromNames(object.choice.chosenAlready, type);
  }

  // adding objecttype if type is object
  if (object.choice.type === 'random') {
    switch (type) {
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
    }
  }
  // repeatable conversion to boolean
  if (Object.hasOwn(object.choice, 'repeatable')) {
    object.choice.repeatable = booleanEnumToBoolean(object.choice.repeatable);
  }
  // some fields in choicceRandomObject and choiceListObject must be converted from string to number
  if (Object.hasOwn(object.choice, 'number')) {
    object.choice.number = parseInt(object.choice.number);
  }
}

function booleanEnumToBoolean(value) {
  return value === '1';
}
