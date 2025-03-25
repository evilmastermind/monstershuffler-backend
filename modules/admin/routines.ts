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

const testRun = false;
const ACTIONS_ASSISTANT_TYPE_FIXER_ID = 'asst_59uT5aswTIb4QXoOojjdJVz2';
const ACTIONS_ASSISTANT_DUPLICATES_FIXER_ID = 'asst_Au9VXiu4IEA0VsUpZi9jrTOS';
const LAST_RUN = new Date('2025-03-24T08:29:10.997Z');

type ObjectContainer = {
  object: Template;
};

export async function launchRoutine() {
  // OBJECTS
  let cursor: number | undefined = undefined;
  const pageSize = 100;
  const totalObjects = await countObjects(6, LAST_RUN);
  let objectsProcessed = 0;
  let counter = 0;
  const startingDate = new Date();
  console.log('Starting routine at', startingDate.toISOString());
  while (objectsProcessed < totalObjects - 1) {
    const objects = await getObjectsWithPagination(0, cursor, pageSize, 6, LAST_RUN);
    objectsProcessed += objects.length;
    cursor = objects[objects.length - 1]?.id;
    for (const object of objects) {
      if (object.lastedited && object.lastedited > LAST_RUN) {
        continue;
      }
      const isSuccessful = await fixObject(object);
      counter++;
      if (!testRun && isSuccessful) {
        await saveObject(object);
        console.log(counter, '/', totalObjects);
      }
    }
  }
}

async function fixObject(object: any) {
  const response = await queryAssistant(
    ACTIONS_ASSISTANT_TYPE_FIXER_ID,
    JSON.stringify(object.object)
  );

  if (response) {
    try {
      // @ts-expect-error - the response type is not really defined
      object.object = JSON.parse(response[0].content[0].text.value);
      return true;
    } catch (e) {
      console.log('❌ error for #', object.id);
      return false;
      // save the object id inside the file using fs
    }
  }
}
