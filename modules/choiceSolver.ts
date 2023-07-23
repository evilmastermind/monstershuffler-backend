import { z } from "zod";
import { AnyObject } from "@/schemas";
import { ChoiceListObject, ChoiceRandomObject, type Choice } from "@/schemas/character/choices";
import { getChoiceObject } from "@/modules/object/object.service";
import { random } from "@/utils/functions";
import { getChoiceLanguage } from "./language/language.service";
import { getChoiceSkill } from "./skill/skill.service";

export async function findChoices(
  object: any,
  father: object | Array<object>,
  fathersKey: string | number,
  userId: number
) {
  if (typeof object === "object") {
    if (Array.isArray(object)) {
      for (let index = 0; index < object.length; index++) {
        await findChoices(object[index], object, index, userId);
      }
    } else {
      for (const [key, value] of Object.entries(object)) {
        if (key === "choice") {
          await resolveChoice(object, father, fathersKey, userId);
        } else {
          await findChoices(value, object, key, userId);
        }
      }
    }
  }
}

type RandomOrList = ChoiceRandomObject | ChoiceListObject;

async function resolveChoice(
  object: RandomOrList,
  father: AnyObject,
  fathersKey: string | number,
  userId: number
) {
  const choice = object.choice;
  switch (choice.type) {
    case "list":
      await resolveListChoice(choice, father, fathersKey);
      break;
    case "random":
      await resolveRandomChoice(choice, father, fathersKey, userId);
      break;
  }
}

async function resolveListChoice(
  choice: ChoiceListObject["choice"],
  father: AnyObject,
  fathersKey: string | number
) {
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
      const randomIndex =
        possibleIndexes[random(0, possibleIndexes.length - 1)];
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

async function resolveRandomChoice(
  choice: ChoiceRandomObject["choice"],
  father: AnyObject,
  fathersKey: string | number,
  userId: number
) {
  const source = choice.source;

  let result: AnyObject | null = {};

  switch (source) {
    case "objects":
      result = await getChoiceObject(userId, choice);
      break;
    case "languages":
      result = await getChoiceLanguage(userId, choice);
      break;
    case "skills":
      result = await getChoiceSkill(userId, choice);
      break;
  }
  father[fathersKey] = result;

}
