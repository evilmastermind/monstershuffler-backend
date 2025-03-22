/**
 * Object Migration 004
 * Date: 2025-22-03
 * Author: Ismael
 * ========================
 * -⚔️ values: "temporary hit points" => "temporary hit point"
 * -🧑‍💼 backgrounds: add a multi attack action fo reach
 * -🧑‍💼 backgrounds: rename their attack action to "profession_weapon"
 */

import { z } from 'zod';
import {
  countObjects,
  getObjectsWithPagination,
  saveObject,
} from '@/modules/admin/admin.service';
import { Template } from '@/modules/template/template.schema';
import {
  Action,
  templateObject,
  raceObject,
  backgroundObject,
  racevariantObject,
} from 'monstershuffler-shared';

const testRun = false;

export default async function migrate() {
  // OBJECTS
  let cursor: number | undefined = undefined;
  const pageSize = 100;
  const totalObjects = await countObjects();
  let objectsProcessed = 0;
  while (objectsProcessed < totalObjects - 1) {
    const objects = await getObjectsWithPagination(0, cursor, pageSize);
    objectsProcessed += objects.length;
    cursor = objects[objects.length - 1]?.id;
    for (const object of objects) {
      await convertObjectRecord(object);
      if (!testRun) {
        await saveObject(object);
      }
    }
  }
}

async function convertObjectRecord(object: any) {
  const objectJSON = object.object;

  if (!objectJSON || typeof objectJSON !== 'object') {
    return;
  }

  switch (object.type) {
    case 1: // character
      await convertCharacter(objectJSON, object.id);
      break;
    case 2: // race
    case 3: // class
    case 4: // template
    case 6: // sentences
    case 10002: // racevariant
    case 10003: // classvariant
      await convertObject(objectJSON, object.id);
      break;
    case 5: // background
      validateObject(objectJSON, object.id, backgroundObject);
      await improveBackgrounds(objectJSON);
      await convertObject(objectJSON, object.id);
      break;
    case 101: // action
      await convertAction(objectJSON);
      break;
    case 102: // spell
      // object.object = convertSpell(objectJSON);
      break;
    case 1001: // weapon
      //
      break;
    case 1002: // armor
      //
      break;
    default:
      break;
  }
}

async function convertCharacter(object: any, id: number) {
  if (Object.hasOwn(object, 'user')) {
    validateObject(object.user, object.id, templateObject);
    await convertObject(object.user, object.id);
  }
  if (Object.hasOwn(object, 'race')) {
    validateObject(object.race, object.id, raceObject);
    await convertObject(object.race, object.id);
  }
  if (Object.hasOwn(object, 'racevariant')) {
    validateObject(object.racevariant, object.id, racevariantObject);
    await convertObject(object.racevariant, object.id);
  }
  if (Object.hasOwn(object, 'class')) {
    validateObject(object.class, object.id, templateObject);
    await convertObject(object.class, object.id);
  }
  if (Object.hasOwn(object, 'classvariant')) {
    validateObject(object.classvariant, object.id, templateObject);
    await convertObject(object.classvariant, object.id);
  }
  if (Object.hasOwn(object, 'template')) {
    validateObject(object.template, object.id, templateObject);
    await convertObject(object.template, object.id);
  }
  if (Object.hasOwn(object, 'background')) {
    validateObject(object.background, object.id, templateObject);
    await convertObject(object.background, object.id);
  }
}

async function convertObject(object: Template, id: number) {
  if (object?.actions?.length) {
    for (const action of object.actions) {
      await convertAction(action);
    }
  }
}

async function convertAction(action: Action) {
  if ('values' in action && action?.values?.length) {
    for (const value of action.values) {
      // @ts-expect-error - this is the incorrect type I'm trying to fix
      if (value.type === 'temporary hit points') {
        value.type = 'temporary hit point';
      }
    }
  }
}

const multiattack: Action = {
  tag: 'action0',
  priority: 20,
  variants: [
    {
      name: 'Multiattack',
      type: 'multiattack',
      description: '[Name] makes {value1} with [their] [profession_weapon].',
      availableAt: 5,
    },
  ],
  availableUnit: 'level',
  values: [
    {
      name: 'value1',
      type: 'attack',
      incrProgression: {
        unitInterval: 6,
        unitIncrement: 3,
        availableAt: 5,
        availableUnit: 'level',
        valueBase: 1,
        valueIncrement: 1,
      },
    },
  ],
};

function improveBackgrounds(background: Template) {
  if (background?.actions?.length) {
    const actions = background.actions;
    for (const action of actions) {
      if ('tag' in action && action.tag === 'profession') {
        action.tag = 'profession_weapon';
      }
    }
    const multiattacks = actions.filter(
      (action) =>
        'variants' in action &&
        action.variants.some((variant) => variant.type === 'multiattack')
    );
    if (!multiattacks.length) {
      actions.push(multiattack);
    }
  }
}

function validateObject(
  object: any,
  id: number,
  schema: z.ZodObject<any, any>
) {
  const result = schema.safeParse(object);
  if (!result.success) {
    throw new Error(
      `Invalid object ${id}: ${JSON.stringify(result.error.errors, null, 2)}`
    );
  }
}
