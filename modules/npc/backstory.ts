import { random, createStats } from 'monstershuffler-shared';
import type { Character } from 'monstershuffler-shared';
import { getCause, getLocation } from './grammars';
import { queryAssistant } from '@/modules/ai/ai.service';
import fs from 'fs';

const filePath = 'resources/002_backstory_sentences.sql';
const BACKSTORY_ASSISTANT_ID = 'asst_VUscAl0mHfPw30ktTa7lREMV';
type SentenceType = 'youth' | 'career' | 'plot';

const classes = ['barbarian','bard','cleric','druid','fighter','monk','paladin','ranger','rogue','sorcerer','warlock','wizard']; 
const professionLocations = ['school', 'barracks', 'ship', 'hospital', 'wilds', 'inn', 'shop', 'stable', 'theatre', 'workshop', 'laboratory', 'church', 'kitchen', 'palace', 'streets', 'office', 'forge'];
const alignmentsEthical = ['Lawful', 'Neutral', 'Chaotic'];
const alignmentsMoral = ['Good', 'Neutral', 'Evil'];
const sentenceTypes: SentenceType[] = ['youth', 'career', 'plot'];

type Sentence = {
  sentence: string;
  summary: string;
}

export async function generateBackstorySentences() {
  let requestNumber = 0;
  try {
    for (let s = 0; s < sentenceTypes.length; s++) {
      for (let i = 0; i < professionLocations.length; i++) {
        for (let j = 0; j < alignmentsEthical.length; j++) {
          for (let k = 0; k < alignmentsMoral.length; k++) {
            requestNumber++;
            console.log(`Request #${requestNumber}`);
            const sentenceType = sentenceTypes[s];
            const plotHookType = random(1,4) === 1 ? await getLocation() : await getCause();
            // const location = professionLocations[i];
            const alignmentEthical = alignmentsEthical[j];
            const alignmentMoral = alignmentsMoral[k];
            const alignment = alignmentEthical === alignmentMoral ? alignmentEthical : `${alignmentEthical} ${alignmentMoral}`;
            // const message = `Generate an NPC backstory sentence with the following parameters: type: ${sentenceType}, hook: ${plotHookType}, ${THIS NEEDS TO BE IMPROVEDlocation}, alignment: ${alignment}`;
            const message = `Generate an NPC backstory sentence with the following parameters: type: ${sentenceType}, hook: ${plotHookType}, alignment: ${alignment}`;
            const response = await queryAssistant(BACKSTORY_ASSISTANT_ID, message);
            if (!response || !response.length) {
              console.error('Failed to generate NPC backstory sentence.');
              continue;
            }
            // @ts-expect-error - it looks like the response is not typed correctly
            const sentence = JSON.parse(response[0].content[0].text.value) as Sentence;
            saveBackstorySentence(sentence, sentenceType, (j+1) + (k+1)*10);
          }
        }
      }
    }
  } catch (err) {
    console.error('Error generating NPC backstory sentences:', err);
  }
}

const sanitize = (value: string) => value.replace(/'/g, '\'\'');


function saveBackstorySentence(sentence: Sentence, type: string, alignment: number, locationOrClass?: string) {
  const location = locationOrClass ? `'${sanitize(locationOrClass)}'` : 'NULL';
  const newRecord = `\n('${type}',${alignment},${location},'${sanitize(sentence.sentence)}','${sanitize(sentence.summary)}')`;

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return;
    }

    // Match INSERT INTO block
    const insertRegex = /(INSERT INTO backstorysentences.*VALUES\s*)([^;]+)(;)/s;
    const match = data.match(insertRegex);

    if (match) {
      let values = match[2].trim();
      
      // Ensure valid formatting (avoid trailing commas)
      if (!values.endsWith(',')) {
        values += ',';
      }

      // Append new record
      const updatedSQL = data.replace(insertRegex, `$1${values} ${newRecord}$3`);

      // Write back to the file
      fs.writeFile(filePath, updatedSQL, 'utf8', (writeErr) => {
        if (writeErr) {
          console.error('Error writing file:', writeErr);
        } else {
          console.log('New record added successfully.');
        }
      });
    } else {
      console.error('INSERT statement not found.');
    }
  });
}
