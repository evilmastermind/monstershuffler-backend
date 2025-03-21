import { random, createStats } from 'monstershuffler-shared';
import type { Character } from 'monstershuffler-shared';
import { getCause, getLocation } from './grammars';
import { queryAssistant } from '@/modules/ai/ai.service';
import fs from 'fs';
import {
  objectsForThisBackstorysentence,
  countBackstorysentences,
  getBackstorysentencesWithPagination,
  postBackstorysentencesobject,
} from './npc.service';

const filePath = 'resources/002_backstory_sentences.sql';
const BACKSTORY_ASSISTANT_ID = 'asst_VUscAl0mHfPw30ktTa7lREMV';
const BACKSTORY_FIXER_ID = 'asst_hb861ktW1N9MZjvoVnhMCmB1';
const ACTIONS_ASSISTANT_ID = 'asst_bDMoludYeaehMKEMQYcwjWDm';
type SentenceType = 'youth' | 'career' | 'plot';

const classes = [
  'barbarian',
  'bard',
  'cleric',
  'druid',
  'fighter',
  'monk',
  'paladin',
  'ranger',
  'rogue',
  'sorcerer',
  'warlock',
  'wizard',
];
const professionLocations = [
  'school',
  'barracks',
  'ship',
  'hospital',
  'wilds',
  'inn',
  'shop',
  'stable',
  'theatre',
  'workshop',
  'laboratory',
  'church',
  'kitchen',
  'palace',
  'streets',
  'office',
  'forge',
];
const alignmentsEthical = ['Lawful', 'Neutral', 'Chaotic'];
const alignmentsMoral = ['Good', 'Neutral', 'Evil'];
const sentenceTypes: SentenceType[] = ['youth', 'career', 'plot'];

type Sentence = {
  sentence: string;
  summary: string;
};

// CLASS VERSION
export async function generateBackstorySentences() {
  let requestNumber = 0;
  try {
    for (let s = 0; s < sentenceTypes.length; s++) {
      for (let i = 0; i < classes.length; i++) {
        for (let j = 0; j < alignmentsEthical.length; j++) {
          for (let k = 0; k < alignmentsMoral.length; k++) {
            requestNumber++;
            const sentenceType = sentenceTypes[s];
            const plotHookType =
              random(1, 4) === 1 ? await getLocation() : await getCause();
            const classChosen = classes[i];
            const alignmentEthical = alignmentsEthical[j];
            const alignmentMoral = alignmentsMoral[k];
            const alignment =
              alignmentEthical === alignmentMoral
                ? alignmentEthical
                : `${alignmentEthical} ${alignmentMoral}`;
            const message = `Generate an NPC backstory sentence with the following parameters: type: ${sentenceType}, hook: ${plotHookType}, class: ${classChosen}, alignment: ${alignment}`;
            // const message = `Generate an NPC backstory sentence with the following parameters: type: ${sentenceType}, hook: ${plotHookType}, alignment: ${alignment}`;
            const response = await queryAssistant(
              BACKSTORY_ASSISTANT_ID,
              message
            );
            if (!response || !response.length) {
              console.error('Failed to generate NPC backstory sentence.');
              continue;
            }
            const sentence = JSON.parse(
              // @ts-expect-error - it looks like the response is not typed correctly
              response[0].content[0].text.value
            ) as Sentence;
            saveBackstorySentence(
              sentence,
              sentenceType,
              j + 1 + (k + 1) * 10,
              classChosen
            );
          }
        }
      }
    }
  } catch (err) {
    console.error('Error generating NPC backstory sentences:', err);
  }
}

export async function generateBackstorySentenceActions() {
  let cursor: number | undefined = undefined;
  const pageSize = 100;
  const totalSentences = await countBackstorysentences();
  let processed = 0;

  while (processed < totalSentences) {
    const sentences = await getBackstorysentencesWithPagination(
      cursor,
      pageSize
    );
    if (!sentences || !sentences.length) {
      break;
    }

    processed += sentences.length;
    cursor = sentences[sentences.length - 1].id;

    for (const sentence of sentences) {
      const actions = await objectsForThisBackstorysentence(sentence.id);
      if (actions > 0) {
        continue;
      }
      const request = `Generate an action, attack, trait, reaction or bonus action for the following sentence: "${sentence.sentence}"`;
      console.log('#', sentence.id);
      const response = await queryAssistant(ACTIONS_ASSISTANT_ID, request);
      if (response && response.length) {
        postBackstorysentencesobject(sentence.id, {
          name: 'sentence',
          actions: [JSON.parse(response[0].content[0].text.value)],
        });
      }
    }
  }
}

// GENERIC VERSION
// export async function generateBackstorySentences() {
//   let requestNumber = 0;
//   try {
//     for (let s = 0; s < sentenceTypes.length; s++) {
//       for (let i = 0; i < professionLocations.length; i++) {
//         for (let j = 0; j < alignmentsEthical.length; j++) {
//           for (let k = 0; k < alignmentsMoral.length; k++) {
//             requestNumber++;
//             const sentenceType = sentenceTypes[s];
//             const plotHookType = random(1,4) === 1 ? await getLocation() : await getCause();
//             // const location = professionLocations[i];
//             const alignmentEthical = alignmentsEthical[j];
//             const alignmentMoral = alignmentsMoral[k];
//             const alignment = alignmentEthical === alignmentMoral ? alignmentEthical : `${alignmentEthical} ${alignmentMoral}`;
//             const message = `Generate an NPC backstory sentence with the following parameters: type: ${sentenceType}, hook: ${plotHookType}, alignment: ${alignment}`;
//             // const message = `Generate an NPC backstory sentence with the following parameters: type: ${sentenceType}, hook: ${plotHookType}, alignment: ${alignment}`;
//             const response = await queryAssistant(BACKSTORY_ASSISTANT_ID, message);
//             if (!response || !response.length) {
//               console.error('Failed to generate NPC backstory sentence.');
//               continue;
//             }
//             // @ts-expect-error - it looks like the response is not typed correctly
//             const sentence = JSON.parse(response[0].content[0].text.value) as Sentence;
//             saveBackstorySentence(sentence, sentenceType, (j+1) + (k+1)*10);
//           }
//         }
//       }
//     }
//   } catch (err) {
//     console.error('Error generating NPC backstory sentences:', err);
//   }
// }

// PROFESSION LOCATION VERSION
// export async function generateBackstorySentences() {
//   let requestNumber = 0;
//   try {
//     for (let s = 0; s < sentenceTypes.length; s++) {
//       for (let i = 0; i < professionLocations.length; i++) {
//         for (let j = 0; j < alignmentsEthical.length; j++) {
//           for (let k = 0; k < alignmentsMoral.length; k++) {
//             requestNumber++;
//             const sentenceType = sentenceTypes[s];
//             const plotHookType = random(1,4) === 1 ? await getLocation() : await getCause();
//             const location = professionLocations[i];
//             const alignmentEthical = alignmentsEthical[j];
//             const alignmentMoral = alignmentsMoral[k];
//             const alignment = alignmentEthical === alignmentMoral ? alignmentEthical : `${alignmentEthical} ${alignmentMoral}`;
//             const message = `Generate an NPC backstory sentence with the following parameters: type: ${sentenceType}, hook: ${plotHookType}, profession_location: ${location}, alignment: ${alignment}`;
//             // const message = `Generate an NPC backstory sentence with the following parameters: type: ${sentenceType}, hook: ${plotHookType}, alignment: ${alignment}`;
//             const response = await queryAssistant(BACKSTORY_ASSISTANT_ID, message);
//             if (!response || !response.length) {
//               console.error('Failed to generate NPC backstory sentence.');
//               continue;
//             }
//             // @ts-expect-error - it looks like the response is not typed correctly
//             const sentence = JSON.parse(response[0].content[0].text.value) as Sentence;
//             saveBackstorySentence(sentence, sentenceType, (j+1) + (k+1)*10, location);
//           }
//         }
//       }
//     }
//   } catch (err) {
//     console.error('Error generating NPC backstory sentences:', err);
//   }
// }

const sanitize = (value: string) => value.replace(/'/g, "''");

function saveBackstorySentence(
  sentence: Sentence,
  type: string,
  alignment: number,
  locationOrClass?: string
) {
  const location = locationOrClass ? `'${sanitize(locationOrClass)}'` : 'NULL';
  const newRecord = `\n('${type}',${alignment},${location},'${sanitize(
    sentence.sentence
  )}','${sanitize(sentence.summary)}')`;

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return;
    }

    // Match INSERT INTO block
    const insertRegex =
      /(INSERT INTO backstorysentences\s*\(.*?\)\s*VALUES\s*)(\([\s\S]*?\))(\s*;)/;
    const match = data.match(insertRegex);

    if (match) {
      let values = match[2].trim();

      // Ensure valid formatting (avoid trailing commas)
      if (!values.endsWith(',')) {
        values += ',';
      }

      // Append new record
      const updatedSQL = data.replace(
        insertRegex,
        `$1${values} ${newRecord}$3`
      );

      // Write back to the file
      fs.writeFile(filePath, updatedSQL, 'utf8', (writeErr) => {
        if (writeErr) {
          console.error('Error writing file:', writeErr);
        }
      });
    } else {
      console.error('INSERT statement not found.');
    }
  });
}

export async function fixBackstorySentences() {
  let cursor: number | undefined = undefined;
  const pageSize = 100;
  const totalSentences = await countBackstorysentences();
  let processed = 0;

  while (processed < totalSentences) {
    const sentences = await getBackstorysentencesWithPagination(
      cursor,
      pageSize
    );
    processed += sentences.length;
    cursor = sentences[sentences.length - 1].id;
    for (const sentence of sentences) {
      const object = {
        sentence: sentence.sentence,
        summary: sentence.summary,
      };
      const response = await queryAssistant(
        BACKSTORY_FIXER_ID,
        JSON.stringify(object)
      );
      // console.info(response[0].content[0].text.value);
    }
  }
}
