import { z } from 'zod';
import { AnyObject, choiceListObject, choiceRandomObject, type Choice } from '@/modules/schemas';
import { getRandomObject } from '@/modules/object/object.service';
import { random } from '@/utils/functions';

export function findChoices(object: any, father: object | Array<object>, fathersKey: string | number) {
  if (typeof object === 'object') {
    if (Array.isArray(object)) {
      object.forEach((value, index) => {
        findChoices(value, object, index);
      });
    } else {
      Object.entries(object).forEach(([key]) => {
        if(key === 'choice') {
          resolveChoice(object, father, fathersKey);
        } else {
          findChoices(object[key], object, key);
        }
      });
    }
  }
}

type Random = z.infer<typeof choiceRandomObject>;
type List = z.infer<typeof choiceListObject>;

type RandomOrList = Random | List;

function resolveChoice(object: RandomOrList, father: AnyObject, fathersKey: string | number) {
  const choice = object.choice;
  switch (choice.type) {
  case 'list':
    resolveListChoice(choice, father, fathersKey);
    break;
  case 'random':
    resolveRandomChoice(choice, father, fathersKey);
    break;
  }
}

function resolveListChoice(choice: List['choice'], father: AnyObject, fathersKey: string | number) {
  const list = choice.list;
  const isRepeatable = choice.isRepeatable || false;
  let number = choice.number || 1;

  if (!isRepeatable && number > list.length) {
    number = list.length;
  }

  const chosen: Choice[] = [];
  let i = 0;

  if (!isRepeatable) {
    const possibleIndexes: number[] = [];
    for (let i = 0; i < list.length; i++) {
      possibleIndexes.push(i);
    }
    while (i < number && possibleIndexes.length > 0) {
      const randomIndex = possibleIndexes[random(0, possibleIndexes.length - 1)];
      chosen.push(list[randomIndex]);
      possibleIndexes.splice(randomIndex, 1);
      i++;
    }
  } else {
    while (i < number) {
      const randomIndex = random(0, list.length - 1);
      chosen.push(list[randomIndex]);
      i++;
    }
  }
  
  father[fathersKey] = chosen;
}

async function resolveRandomChoice(choice: Random['choice'], father: object, fathersKey: string | number) {
  const source = choice.source;

  let result: AnyObject | null = {};

  switch (source) {
  case 'objects':
    await getRandomObject(0, choice);
    break;
  }
}
