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
import { actionObject, templateObject } from 'monstershuffler-shared';
import { Client } from 'pg';

const testRun = false;

export default async function migrate(client: Client) {
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
      await convertObjectRecord(object, client);
      if (!testRun) {
        await saveObject(object);
      }
    }
  }
}

async function convertObjectRecord(object: any, client: Client) {
  const objectJSON = object.object;

  if (!objectJSON || typeof objectJSON !== 'object') {
    return;
  }

  switch (object.type) {
    case 6: // sentences
      await checkActions(objectJSON, object.id, client);
      break;
    default:
      break;
  }
}

async function checkActions(object: Template, id: number, client: Client) {
  if ('actions' in object && object.actions?.length) {
    for (const action of object.actions) {
      const result = actionObject.safeParse(action);
      if (!result.success) {
        const result = await client.query(
          'SELECT backstorysentenceid from backstorysentencesobjects where objectid = $1',
          [id]
        );
        console.error('Invalid action', result.rows[0].backstorysentenceid);
      }
    }
  }
}
