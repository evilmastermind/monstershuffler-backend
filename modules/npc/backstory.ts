import { random, createStats } from 'monstershuffler-shared';
import type { Character } from 'monstershuffler-shared';
import { getCause, getLocation } from './grammars';
import { queryAssistant } from '@/modules/ai/ai.service';

const BACKSTORY_ASSISTANT_ID = 'asst_VUscAl0mHfPw30ktTa7lREMV';
type SentenceType = 'youth' | 'career' | 'plot';

export async function generateBackstoryLines(character: Character) {
  const plotHookType = random(1,4) === 1 ? await getLocation() : await getCause();
  const type: SentenceType = 'plot';

  const s = character.statistics!;
  const c = character.character;

  if (!s) {
    createStats(character);
  }

  const locationOrClass = c?.class?.name? c.class.name : c?.background?.workplace || '';
  const locationOrClassDescription = `${c?.class?.name? 'class': 'profession_location'}: ${locationOrClass}`;
  
  const message = `Generate an NPC backstory sentence with the following parameters: type: ${type}, hook: ${plotHookType} alignment: ${s.alignment.string}`;

  await queryAssistant(BACKSTORY_ASSISTANT_ID, message);
}
