import {
  countObjects,
  getObjectsWithPagination,
  saveObject,
  getSpellDataFromName,
  getIdsFromNames,
  convertBackgroundPronouns,
} from './admin.service';
import { queryAssistant } from '@/modules/ai/ai.service';
import * as fs from 'fs';
import * as readline from 'readline';
import type { Template } from '../template/template.schema';

const ACTIONS_ASSISTANT_TYPE_FIXER_ID = 'asst_59uT5aswTIb4QXoOojjdJVz2';
const ACTIONS_ASSISTANT_DUPLICATES_FIXER_ID = 'asst_Au9VXiu4IEA0VsUpZi9jrTOS';

////////////////////////////
////////////////////////////
// !! CONFIGURATION !!
////////////////////////////
const testRun = false;
const LAST_RUN = new Date('2025-03-26T00:00:00.997Z');
const ASSISTANT = ACTIONS_ASSISTANT_DUPLICATES_FIXER_ID;
////////////////////////////
////////////////////////////

type ObjectContainer = {
  object: Template;
};

export async function launchRoutine() {
  // await fixObjectsWithAssistant();
  await fixObjectsInFile();
}

const types = [
  'target',
  'attack',
  'creature',
  'humanoid',
  'round',
  'minute',
  'hour',
  'day',
  'DC Strength',
  'DC Dexterity',
  'DC Constitution',
  'DC Intelligence',
  'DC Wisdom',
  'DC Charisma',
  'DC Strength saving throw',
  'DC Dexterity saving throw',
  'DC Constitution saving throw',
  'DC Intelligence saving throw',
  'DC Wisdom saving throw',
  'DC Charisma saving throw',
  'hit point',
  'temporary hit point',
  '+',
  '-st-nd-rd',
  'feet',
  '-feet',
  'time',
  'damage',
];

async function fixObjectsInFile() {
  const inputPath = 'resources/objects.sql';
  const outputPath = 'resources/objects_cleaned.sql';
  try {
    // Read the entire file content
    const fileContent = fs.readFileSync(inputPath, 'utf-8');

    // Create a regex that matches the specific pattern
    const cleanedContent = fileContent.replace(
      /("value[0-9]+", "type": "([^"]+)".*?){value[0-9]+} \2s?\b/g,
      '$1}'
    );

    // Write the cleaned content to the output file
    fs.writeFileSync(outputPath, cleanedContent, 'utf8');

    console.info('File successfully cleaned and processed.');
  } catch (error) {
    console.error('Error processing file:', error);
  }
}

async function fixObjectsWithAssistant() {
  // OBJECTS
  let cursor: number | undefined = undefined;
  const pageSize = 100;
  const totalObjects = await countObjects(6, LAST_RUN);
  let objectsProcessed = 0;
  let counter = 0;
  const startingDate = new Date();
  console.info('Starting routine at', startingDate.toISOString());
  while (objectsProcessed < totalObjects - 1) {
    const objects = await getObjectsWithPagination(
      0,
      cursor,
      pageSize,
      6,
      LAST_RUN
    );
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
        console.info(counter, '/', totalObjects);
      }
    }
  }
}

async function fixObject(object: any) {
  const response = await queryAssistant(
    ASSISTANT,
    JSON.stringify(object.object)
  );

  if (response) {
    try {
      // @ts-expect-error - the response type is not really defined
      object.object = JSON.parse(response[0].content[0].text.value);
      return true;
    } catch (e) {
      console.info('❌ error for #', object.id);
      return false;
      // save the object id inside the file using fs
    }
  }
}
