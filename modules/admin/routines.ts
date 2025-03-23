import {
  countObjects,
  getObjectsWithPagination,
  saveObject,
  getSpellDataFromName,
  getIdsFromNames,
  convertBackgroundPronouns,
} from './admin.service';
import { queryAssistant } from '@/modules/ai/ai.service';
import type { Template } from '../template/template.schema';
import fs from 'fs';

const testRun = true;
const ACTIONS_ASSISTANT_TYPE_FIXER_ID = 'asst_59uT5aswTIb4QXoOojjdJVz2';
const ACTIONS_ASSISTANT_DUPLICATES_FIXER_ID = 'asst_Au9VXiu4IEA0VsUpZi9jrTOS';

type ObjectContainer = {
  object: Template;
};

export async function launchRoutine() {
  // OBJECTS
  let cursor: number | undefined = undefined;
  const pageSize = 100;
  const totalObjects = await countObjects(6);
  let objectsProcessed = 0;
  let counter = 0;
  while (objectsProcessed < totalObjects - 1) {
    const objects = await getObjectsWithPagination(0, cursor, pageSize, 6);
    objectsProcessed += objects.length;
    cursor = objects[objects.length - 1]?.id;
    for (const object of objects) {
      await fixObject(object);
      counter++;
      console.log(counter, '/', totalObjects);
      if (!testRun) {
        await saveObject(object);
      }
    }
  }
}

async function fixObject(object: any) {
  const filePath = 'resources/failed_objects.txt';
  const response = await queryAssistant(
    ACTIONS_ASSISTANT_TYPE_FIXER_ID,
    JSON.stringify(object.object)
  );

  if (response) {
    try {
      // @ts-expect-error - the response type is not really defined
      object.object = JSON.parse(response[0].content[0].text.value);
    } catch (e) {
      console.log('❌ error for #', object.id);
      // save the object id inside the file using fs
      fs.appendFileSync(filePath, object.id + '\n');
    }
  }
}
