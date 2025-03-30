import { replaceTags, random, createStats } from 'monstershuffler-shared';
import {
  parsePolygenGrammar,
  sanitizePolygenString,
} from '@/modules/polygen/polygen.service';
import type { Character, Abilities } from 'monstershuffler-shared';
import { getCause, getEnvironment, getLocation } from './grammars';
import { getRandomCharacterhook } from '../characterhook/characterhook.service';

async function getAlignmentDescription(
  alignment: string,
  character: Character
) {
  let description = '';
  switch (alignment) {
    case 'Lawful Good':
      description = `S ::= 
  "[Name] is a paragon of virtue, and [he] always tries to do the right thing" |
  "[Name] is a shining example of goodness and righteousness" |
  "[Name] is a beacon of hope and justice in a dark world" |
  "[Name] is a hero who fights for justice and righteousness"
  ;`;
      break;
    case 'Neutral Good':
      description = `S ::=
  "[Name] is a good person, but [he] doesn't let [his] morals get in the way of doing what's right" |
  "[Name] is a kind-hearted soul who always tries to do the right thing" |
  "[Name] is a compassionate person who always tries to help those in need" |
  "[Name] is a good person who always tries to do what's right, no matter the cost"
  ;`;
      break;
    case 'Chaotic Good':
      description = `S ::= 
  "[Name] is a rebel who fights against tyranny and oppression, no matter the cost" |
  "[Name] is a free spirit who follows [his] own whims, with disregard for the law" |
  "[Name] follows [his] heart, no matter where it leads, and always tries to do the right thing"
  ;`;
      break;
    case 'Lawful Neutral':
      description = `S ::= 
  "[Name] follows the law to the letter, no matter what" |
  "[Name] is a stickler for rules and regulations" |
  "[Name] believes in order and structure, and always follows the rules" |
  "[Name] is a pragmatist who follows the law, no matter what" |
  "[Name] is a realist who believes in the rule of law"
  ;`;
      break;
    case 'Neutral':
      description = `S ::= 
  "[Name] is a pragmatist who does whatever it takes to get the job done" |
  "[Name] is a realist who believes in doing what's best for [himself] and [his] friends" |
  "[Name] is a neutral force in the world, who doesn't feel strongly one way or the other about morality" |
  "[Name] is a neutral party who doesn't take sides in conflicts" |
  "[Name] is a neutral observer who doesn't get involved in the affairs of others"
  ;`;
      break;
    case 'Chaotic Neutral':
      description = `S ::= 
  "[Name] is a free spirit who follows [his] own whims, with disregard for the law" |
  "[Name] is a rebel who fights rules and restrictions" |
  "[Name] is a wild card who follows [his] own path, no matter where it leads" |
  "[Name] does whatever [he] wants, whenever [he] wants, with no regard for the consequences" |
  "[Name] is a force of chaos in the world, who follows [his] own whims and desires" |
  "[Name] loves randomness and disorder, and acts according to whatever [he] feels like doing"
  ;`;
      break;
    case 'Lawful Evil':
      description = `S ::=
  "[Name] seeks power and control, and will hurt others to get it. [He] follows a strict code of conduct" |
  "[Name] is a tyrant who rules with an iron fist, and will do whatever it takes to maintain power" |
  "[Name] is a ruthless dictator who will stop at nothing to achieve [his] goals" |
  "[Name] is a villain who believes in order and structure, and will do whatever it takes to maintain it" |
  "[Name] oppresses others to maintain order and control, and will do whatever it takes to achieve [his] goals"
  "[Name] is willing to hurt others to get what [he] wants, but follows a strict code of conduct"
  ;`;
      break;
    case 'Neutral Evil':
      description = `S ::=
  "[Name] does whatever it takes to get what [he] wants, no matter who gets hurt" |
  "[Name] is a selfish and ruthless individual who will stop at nothing to achieve [his] goals" |
  "[Name] is a cold-hearted villain who will do whatever it takes to get what [he] wants" |
  "[Name] finds pleasure in the suffering of others" |
  "[Name] has hurt others to get what [he] wants, and will do so again if necessary" |
  "[Name] is a villain who enjoys causing pain and suffering to others"
  ;`;
      break;
    case 'Chaotic Evil':
      description = `S ::= 
  "[Name] acts according to whatever [his] greed, hatred, and lust for destruction drives [him] to do" |
  "[Name] is a force of chaos and destruction in the world, who revels in causing pain and suffering to others" |
  "[Name] is a sadistic villain who enjoys causing pain and suffering to others" |
  "[Name] is a madman who revels in chaos and destruction, and will do whatever it takes to achieve [his] goals" |
  "[Name] is a monster who enjoys causing pain and suffering to others" |
  "[Name] roams the land, spreading chaos and destruction wherever [he] goes" |
  "[Name] has no purpose other than to cause pain and suffering to others"
  ;`;
      break;
    case 'Alignment':
      description =
        'S ::= "[Name] can fit into any alignment, depending on the situation";';
      break;
    case 'Unaligned':
      description =
        'S ::= "[Name] doesn\'t feel strongly one way or the other about morality";';
      break;
    case 'Any Good':
    case 'Good':
      description = 'S ::= "[Name] is a force for good in the world";';
      break;
    case 'Any Evil':
    case 'Evil':
      description = 'S ::= "[Name] is a force for evil in the world";';
      break;
    case 'Any Lawful':
    case 'Lawful':
      description = 'S ::= "[Name] believes in order and structure";';
      break;
    case 'Any Chaotic':
    case 'Chaotic':
      description =
        'S ::= "[Name] believes in personal freedom and self-expression";';
      break;
    case 'Any Neutral':
      description = 'S ::= "[Name] is a neutral force in the world";';
      break;
    default:
      description = 'S ::= "[Name] has no inclination towards any alignment";';
      break;
  }
  description = parsePromptTags(description, character);
  description = await parsePolygenGrammar(description);
  return description;
}

function getSimpleAlignmentDescription(alignment: string) {
  switch (alignment) {
    case 'Lawful Good':
      return 'good and honourable';
    case 'Neutral Good':
      return 'good';
    case 'Chaotic Good':
      return 'good and unpredictable';
    case 'Lawful Neutral':
      return 'lawful';
    case 'Neutral':
      return 'neutral';
    case 'Chaotic Neutral':
      return 'unpredictable';
    case 'Lawful Evil':
      return 'evil but honourable';
    case 'Neutral Evil':
      return 'evil';
    case 'Chaotic Evil':
      return 'evil and unpredictable';
    case 'Alignment':
      return 'adaptable';
    case 'Unaligned':
      return '';
    case 'Any Good':
    case 'Good':
      return 'good';
    case 'Any Evil':
    case 'Evil':
      return 'evil';
    case 'Any Lawful':
    case 'Lawful':
      return 'lawful';
    case 'Any Chaotic':
    case 'Chaotic':
      return 'chaotic';
    case 'Any Neutral':
      return 'neutral';
    default:
      return '';
  }
}

function getInvolvmentInTheAdventure(alignment: string, name: string) {
  if (alignment.includes('Good')) {
    return 'needs help to prevent it and should be considered an ally';
  }
  if (alignment.includes('Evil')) {
    return `is behind it and should be considered an enemy. ${name} should be revealed only at the climax of the adventure, after clues have lead the players to suspect ${name} as the villain`;
  }
  return 'is involved in it and could be an ally or an enemy';
}

function getArchetypeDescription(archetype: string) {
  switch (archetype) {
    case 'Beast':
      return '[Name] is a reckless warrior who enrages in battle, transforming into a beastly form to gain power';
    case 'Berserker':
      return '[Name] is a reckless warrior who enrages in battle';
    case 'Hurler':
      return '[Name] is a warrior who hurls objects at [his] enemies with deadly accuracy';
    case 'College of Lore':
      return '[Name] is a bard who uses [his] magic, knowledge and wit to outsmart [his] enemies';
    case 'College of Whispers':
      return '[Name] is a bard who uses [his] knowledge and magic to uncover secrets and turn them against others through extortion and threats';
    case 'Death Domain':
      return '[Name] is an armored warrior who is concerned with the forces that cause death. [His] deity has granted [him] divine powers that harm others through necrotic and negative energy';
    case 'Life Domain':
      return '[Name] is an armored warrior who is concerned with the vibrant positive energy that sustains all life. [His] deity has granted [him] divine powers that heal and protect others';
    case 'War Domain':
      return '[Name] is an armored warrior who is concerned with the art of war. [His] deity has granted [him] divine powers that help [him] and [his] allies in battle';
    case 'Arctic':
      return '[Name] is a protector of frozen lands and the creatures that live there. [He] can transform into one of the beasts of the arctic, or cast powerful spells attuned the cold lands [he] calls home';
    case 'Forest':
      return '[Name] is a protector of the forest and the creatures that live there. [He] can transform into one of the beasts of the forest, or cast powerful spells attuned to the natural world [he] calls home';
    case 'Underdark':
      return '[Name] is a protector of the underdark and the creatures that live there. [He] can transform into one of the beasts of the underdark, or cast powerful spells attuned to the dark lands [he] calls home';
    case 'Dexterous':
      return '[Name] is a skilled warrior who uses [his] agility and speed to outmaneuver [his] enemies';
    case 'Tank':
      return '[Name] is a heavily armored warrior who can take a lot of damage and protect [his] allies';
    case 'Two-Handed Weapons':
      return '[Name] is a warrior who wields a massive weapon with deadly precision';
    case 'Four Elements':
      return '[Name] is a monk who has mastered the elements, using [his] ki to harness the power of fire, water, earth, and air';
    case 'Way of the Open Hand':
      return '[Name] is a monk who uses [his] ki to heal and protect [his] allies, and to strike down [his] enemies with deadly precision';
    case 'Oath of Devotion':
      return '[Name] is an armored fighter wielding divine magic, who has sworn an oath to uphold the values of [his] deity';
    case 'Oath of Vengeance':
      return '[Name] is an armored fighter wielding divine magic, who has sworn an oath to destroy [his] enemies';
    case 'Archer':
      return '[Name] is a skilled archer who wanders the land, and can cast spells attuned to the natural world [he] calls home';
    case 'Dual Wielder':
      return '[Name] is a skilled warrior who wanders the land. [He] fights with two deadly weapons, and can cast spells attuned to the natural world [he] calls home';
    case 'Protector':
      return '[Name] is a skilled warrior who wanders the land. [He] can cast spells attuned to the natural world [he] calls home, and can use [his] weapons and shield to protect [his] allies';
    case 'Assassin':
      return '[Name] is a skilled killer who uses stealth and cunning to take down [his] enemies';
    case 'Thief':
      return '[Name] is a skilled thief who uses stealth and cunning to get what [he] wants';
    case 'Aberrant Mind':
      return '[Name] is a sorcerer who has been touched by the far realm, and can cast spells that warp reality and the minds of others';
    case 'Draconic Bloodline':
      return '[Name] is a sorcerer who has inherited the power of dragons, and can cast spells that harness the power of the elements';
    case 'Archfey Patron':
      return '[Name] is a warlock who has made a pact with a powerful archfey, and can cast spells that manipulate the forces of nature';
    case 'Fiend Patron':
      return '[Name] is a warlock who has made a pact with a powerful fiend, and can cast spells that harness the power of the lower planes';
    case 'Great Old One Patron':
      return '[Name] is a warlock who has made a pact with a powerful great old one, and can cast spells that warp reality and the minds of others';
    case 'Abjurer':
      return '[Name] is a wizard who specializes in protective magic, and can cast spells that shield [him] and [his] allies from harm';
    case 'Conjurer':
      return '[Name] is a wizard who specializes in summoning magic, and can cast spells that call forth creatures and objects to aid [him] in battle';
    case 'Diviner':
      return '[Name] is a wizard who specializes in divination magic, and can cast spells that reveal secrets and predict the future';
  }
  return '';
}
export type RoleplayStats = {
  name: string;
  gender: string;
  race: string;
  hook: string;
  classDetails?: string;
  professionDetails?: string;
  bodyType: string;
  height: string;
  age: string;
  stats: string;
  weapons: string;
  armor: string;
  alignment: string;
  location: string;
  environment: string;
  personality: string;
  bodyColors: string;
  voice: string;
  involvment: string;
  cause: string;
};

function describeStats(abilities: Abilities): string {
  const output = [];
  if (abilities.STR.score.number <= 9) {
    output.push('weak');
  } else if (abilities.STR.score.number > 12) {
    output.push('muscular and strong');
  }
  if (abilities.DEX.score.number <= 9) {
    output.push('clumsy');
  } else if (abilities.DEX.score.number > 12) {
    output.push('quick and nimble');
  }
  if (abilities.CON.score.number <= 9) {
    output.push('frail');
  } else if (abilities.CON.score.number > 12) {
    output.push('tough and hardy');
  }
  if (abilities.INT.score.number <= 9) {
    output.push('dull');
  } else if (abilities.INT.score.number > 12) {
    output.push('intelligent and sharp');
  }
  if (abilities.WIS.score.number <= 9) {
    output.push('unwise');
  } else if (abilities.WIS.score.number > 12) {
    output.push('wise and perceptive');
  }
  if (abilities.CHA.score.number <= 9) {
    output.push('uncharismatic');
  } else if (abilities.CHA.score.number > 12) {
    output.push('charming and persuasive');
  }
  return output.join(', ') || 'average';
}

export async function parseRoleplayStats(
  character: Character,
  hookIndex: number | undefined
): Promise<RoleplayStats> {
  const c = character.character;
  const s = character.statistics;
  const t = character.tags;

  if (!t || !s) {
    throw new Error('Character tags or statistics are missing');
  }

  const name = s.fullName || '';
  let gender = '';
  if (s.pronouns === 'neutral') {
    gender = 'nonbinary (use they/them pronouns)';
  } else if (s.pronouns === 'thing') {
    gender = 'No gender (use it/its pronouns)';
  } else {
    gender = s.pronouns;
  }
  const race = s.race || '';
  const hook = parsePromptTags(
    c.characterHooks?.[hookIndex || 0]?.sentence ||
      (await getRandomCharacterhook({}))?.sentence ||
      '',
    character
  );
  const classDetails = character.character.classvariant
    ? getArchetypeDescription(character.character.classvariant?.name)
    : '';
  let professionDetails = '';
  if (character.character?.background) {
    professionDetails = `${character.character?.background?.name} (${character.character?.background?.description})`;
  }
  const armor = s?.AC?.name || '';
  const weapons =
    s?.actions
      ?.filter((action) => action.string.includes('Attack'))
      ?.map((action) => action.name)
      .join(', ') || '';
  const age = `${s.age?.name || 'unspecified'}`;
  const stats = describeStats(s.abilities);
  const bodyType = s.bodyType || '';
  const height = character.character?.height?.toString() || '';
  const simpleAlignment = `${getSimpleAlignmentDescription(
    s.alignment.string
  )}`;
  const alignment = await getAlignmentDescription(
    s.alignment.string,
    character
  );
  const personality = s.personality
    ? `${s.personality.name} (${s.personality.description})`
    : '';
  const voice = s.voice || '';
  const involvment = getInvolvmentInTheAdventure(s.alignment.string, name);
  const cause = await getCause();
  const bodyColors = await parsePolygenGrammar(`
S ::= "skin:" pick a (light|dark) color, "hair:" pick a (light|dark) color, "eyes:" pick a (light|dark) color;
  `);

  const location = await getLocation();
  const environment = await getEnvironment();

  const roleplayStats: { [key: string]: string } = {
    name,
    gender,
    race,
    hook,
    classDetails,
    professionDetails,
    age,
    stats,
    bodyType,
    height,
    armor,
    weapons,
    alignment: random(1, 2) === 1 ? alignment : simpleAlignment,
    personality,
    voice,
    bodyColors,
    involvment,
    cause,
    location,
    environment,
  };

  for (const key in roleplayStats) {
    roleplayStats[key] = sanitizePolygenString(roleplayStats[key]);
  }
  return roleplayStats as RoleplayStats;
}

// function testPolygenCapabilities(character: Character) {
//   return `
//     S ::= ("Write a poem" |
//     "Explain fission in layman's terms" | "Write a short story") ;
//   `;
// }

export async function getPhysicalAppearancePrompt(
  character: Character,
  stats: RoleplayStats
) {
  if (!character.statistics) {
    createStats(character);
  }
  const prompt = `
  Describe the physical appearance of an NPC in a Dungeons & Dragons adventure in up to 70 words,
  as if you were a Dungeon Master describing [him] to a player.
  Focus on their looks, expression, clothing, and any other notable details.
  Avoid mentioning their name, alignment, profession, magical abilities, or nature.
  Don't refer to the NPC as "NPC", just describe [him] as if [he] were a real person.
  [His] name is ${stats.name}, 
  [He] is a ${stats.age} ${stats.gender} ${stats.race}.
  ${
    stats.bodyType
      ? `[His] body type is ${stats.bodyType}, [his] height is ${
          stats.height || 'average'
        }.`
      : ''
  }
  [His] physical and mental traits: ${stats.stats}.
  [His] body colors (replace light/dark with appropriate colors for [his] race): ${
    stats.bodyColors
  }.
  ${stats.armor ? `[His] armor is ${stats.armor}.` : ''}
  ${stats.weapons ? `Items or weapons [he] carries: ${stats.weapons}.` : ''}
  Profession details: ${describeCharacterProfession(
    stats.classDetails,
    stats.professionDetails
  )}.
  [His] defining personality trait is ${stats.personality}, and ${
    stats.alignment
  }.;
  `;
  return parsePromptTags(prompt, character);
}

function describeCharacterProfession(
  classDetails?: string,
  professionDetails?: string
): string {
  let output = '';
  if (professionDetails) {
    output += `[He] is a ${professionDetails}. `;
    if (classDetails) {
      output += 'In addition, [he] possesses other skills: ';
    }
  }
  if (classDetails) {
    output += classDetails;
  }
  return output;
}

export async function getBackstoryPrompt(
  character: Character,
  stats: RoleplayStats
) {
  if (!character.statistics) {
    createStats(character);
  }
  const backstoryType = random(1, 4);
  let backstory = '';
  switch (backstoryType) {
    case 1:
    case 2:
    case 3:
      backstory = await getExcerptPrompt(character, stats);
      break;
    default:
      backstory = await getTabloidPrompt(character, stats);
  }
  backstory = await parsePolygenGrammar(backstory);
  return backstory;
}

/**
 * "- provide one possible cause, which is tied to a ${
    stats.cause
  }, and give proof of it in the excerpt"
 */
async function getTabloidPrompt(character: Character, stats: RoleplayStats) {
  const backstory = `S ::=
"Write an excerpt from an imaginary fantasy medieval gossip tabloid, in markdown format."
"- do not write any title"
"- start with ... a truncated sentence, as if the excerpt was extracted randomly from the article"
"- also end with a truncated sentence..."
"- only write the excerpt, no other text must be included (no title, no author, no ending line, etc.)"
"- write in the style of a Fox News special report"
"- make the excerpt around 100 words long"
"- do not use the word 'shadow'."
"- Imagine this excerpt to be extracted from an article that talks about a character"
"- The excerpt will speculate about this information about the character: ${
    stats.hook
  }"
"- do not mention the character hook directly, or the character's traits but hint at them, just be inspired by them"
"- avoid including rituals or similar elements in the excerpt. Simply focus on [His] profession"
"- additional details about the character: "
"[His] name is ${stats.name}, "
"[He] is a ${stats.age} ${stats.gender} ${stats.race}."
"Profession details: ${describeCharacterProfession(
    stats.classDetails,
    stats.professionDetails
  )}."
"[His] defining personality trait is '${stats.personality}', and ${
    stats.alignment
  }. ";
`;
  return parsePromptTags(backstory, character);
}

/**
 *   "- Tie the character to a ${
    stats.cause
  } in the excerpt, and make it the reason for the character's actions or feelings or thoughts"
 */
async function getExcerptPrompt(character: Character, stats: RoleplayStats) {
  const backstory = `S ::=
  "Write an excerpt from an imaginary fantasy novel, in markdown format."
  "- do not write any title"
  "- start with ...a truncated sentence, as if the excerpt was extracted randomly from the novel"
  "- also end with a truncated sentence..."
  "- only write the excerpt, no other text must be included (no title, no author, no ending line, etc.)"
  "- make the excerpt around 100 words long"
  "- this excerpt comes from a chapter in which a character of the book has" ([his] most defining moment in the novel | a significative interaction with another character | an ordinary moment in [his] life | a moment in [his] daily job | a moment where [he] makes an important decision )
  "- This moment should revolve about this information about the life of character: ${
    stats.hook
  }"
  "- do not mention the character hook directly, or the character's traits, but hint at them, just be inspired by them"
  "- Avoid including rituals or similar elements in the excerpt. Simply focus on [His] profession"
  "- additional details about the character: "
  "[His] name is ${stats.name}, "
  "[He] is a ${stats.age} ${stats.gender} ${stats.race}."
  "Profession details: ${describeCharacterProfession(
    stats.classDetails,
    stats.professionDetails
  )}."
  "[His] defining personality trait is ${stats.personality}, and ${
    stats.alignment
  }.";
  `;
  return parsePromptTags(backstory, character);
}

export async function getDnDAdventurePrompt(
  character: Character,
  stats: RoleplayStats,
  excerpt = ''
) {
  if (!character.statistics) {
    createStats(character);
  }
  let adventure = '';

  const adventureAtWork = `
S ::=
  "Write a Dungeons and Dragons adventure in markdown format."
  "The adventure should have this markdown format 
  (start directly with the following line, including the markdown quote character >, and don't write other syntax):
  > A small sentence describing a moment in the adventure from the perspective of the NPC, where we can get a glimpse of [his] personality
  ## Adventure idea: [write the name of the adventure[]
  [write an introduction]
  ### Secret 1: [write a title for the secret[]
  [write a description of the secret].
  [repeat for at least 4 secrets]
  ### Climax: [write a name for the climax of the adventure[]
  [write the climax description and conclusion[]."
  "Secrets are steps which define a linear path that the player characters playing the adventure will follow to complete the adventure, by discovering pieces of the story until they reach the final climax. The first secret should be about who hired the adventurers or what drove them to investigate."
  "The adventure will revolve around an an NPC and [his] profession."
  "The player characters will be hired by a third party to solve" (an issue | a threat | a menace) "that will be strictly related to a life detail about the character, and will have to investigate the situation to find out what is happening before things get worse."
  "Whatever threat or issue the player characters are trying to solve, ${
    stats.name
  } ${stats.involvment}."
  ["If the NPC's profession or life detail are not related to magic, AVOID INCLUDING ANY MAGIC OR SPELLS IN THE ADVENTURE. This is very important, because the adventure must focus on the NPC's profession, which could be ordinary."]
  "The NPC which is going to be the cue for the adventure is the following:"
  "${stats.name} is a ${stats.age} ${stats.gender} ${stats.race}."
  "Profession details: ${describeCharacterProfession(
    stats.classDetails,
    stats.professionDetails
  )}."
  "[His] defining personality trait is '${stats.personality}', and ${
    stats.alignment
  }. "
  "[His] physical and mental traits: ${stats.stats}."
  "This is the life deatail about the character that will be the cue for the adventure: ${
    stats.hook
  }"
  "Create other NPCs if necessary."
  `;
  //   const adventureAtWork = `
  // S ::=
  //   "Write a Dungeons and Dragons adventure in markdown format."
  //   "The adventure should have this markdown format
  //   (start directly with the following line, including the markdown quote character >, and don't write other syntax):
  //   > A small sentence describing a moment in the adventure from the perspective of the NPC, where we can get a glimpse of [his] personality
  //   ## Adventure idea: (write the name of the adventure)
  //   [write an introduction]
  //   ### Secret 1: (write a title for the secret)
  //   [write a description of the secret].
  //   [repeat for at least 4 secrets]
  //   ### Climax: (write a name for the climax of the adventure)
  //   (write the climax description and conclusion)."
  //   "Secrets are steps which define a linear path that the player characters playing the adventure will follow to complete the adventure, by discovering pieces of the story until they reach the final climax. The first secret should be about who hired the adventurers or what drove them to investigate."
  //   "The adventure will revolve around an an NPC and [his] profession."
  //   "The player characters will be hired by a third party to solve" (an issue | a threat | a menace) "that will be strictly related to the NPC's profession, and will have to investigate the situation to find out what is happening before things get worse."
  //   "Whatever threat or issue the player characters are trying to solve, ${
  //     stats.name
  //   } ${stats.involvment}."
  //   "Make sure to include" ( "" |++ a "${
  //     stats.cause
  //   }" as the cause of the problem, and ) a ("${
  //     stats.location
  //   } as one of the locations" | "${
  //     stats.environment
  //   } as the environment" ) "of the adventure."
  //   "Use also the NPC's character hook to shape the adventure."
  //   ["If the NPC's profession is not related to magic, AVOID INCLUDING ANY MAGIC OR SPELLS IN THE ADVENTURE. This is very important, because the adventure must focus on the NPC's profession and the issue arised."]
  //   "The NPC which is going to be the cue for the adventure is the following:"
  //   "${stats.name} is a ${stats.age} ${stats.gender} ${stats.race}."
  //   "Profession details: ${describeCharacterProfession(
  //     stats.classDetails,
  //     stats.professionDetails
  //   )}."
  //   "Character hook: ${stats.characterHook}."
  //   "[His] defining personality trait is '${stats.personality}', and ${
  //     stats.alignment
  //   }. "
  //   "[His] physical and mental traits: ${stats.stats}."
  //   "Create other NPCs if necessary."
  //   `;
  /**
   * 2024-10-04: the "Adventure at work" prompt is WAY BETTER than this other one.
   */
  //   const adventureAtRandom = `
  // S ::=
  //   "Write a Dungeons and Dragons adventure in markdown format."
  //   "The adventure should be held in a" ("${stats.location}" | "${stats.environment}" environment).
  //   "The adventure should have this markdown format:
  //   (start directly with the following line, don't write \`\`\`markdown or other syntax)
  //   ## Adventure idea: [write the name of the adventure]
  //   [write an introduction]
  //   ### Secret 1: [write a title for the secret]
  //   [write a description of the secret].
  //   [repeat for at least 4 secrets]
  //   ### Climax: [write a name for the climax of the adventure]
  //   [write the climax description and conclusion]."
  //   "Secrets are steps which define a linear path that the player characters playing the adventure will follow to complete the adventure, by discovering pieces of the story until they reach the final climax."
  //   "The adventure must revolve around a ${stats.cause}, which is a threat to" ("the life of another NPC" | "the life of many NPCs" | "the life of someone close to the NPC" | the life of innocent people| the life of a "good-aligned" monster from the dungeons and dragons 5th edition books | forces stopping an "evil-aligned" monster from the game dungeons and dragons 5th edition from hurting people | the life of a local ruler | the life of a local ( hero | villain) | the political balance of the local area | the equilibrium between two political forces | the equilibrium between two secret factions |- the borders between the material plane and another plane of existence from the dungeons and dragons books | the balance of nature | the fate of the kingdom |- the future of the world | the life of the player characters).
  //   "The cause of the threat (${stats.cause}) is never mentioned at the beginning of the adventure, and will be revealed towards the end of the adventure, through investigation or by being revealed by an NPC."
  //   "A NPC, ${stats.name}, is going to be present, at some point, in the adventure."
  //   "Whatever situation the player characters are trying to solve, ${stats.name} ${stats.involvment}."
  //   "${stats.name} is a ${stats.age} ${stats.gender} ${stats.race}."
  //   "Profession details: ${describeCharacterProfession(stats.classDetails, stats.professionDetails)}."
  //   "[His] defining personality trait is '${stats.personality}', and ${stats.alignment}. "
  //   "Include other NPCs if necessary"
  //   "Avoid including rituals or similar elements in the adventure. Simply focus on the ${stats.cause}."
  //   `;

  //   switch (random(1,1)) {
  //   case 1:
  //     adventure = adventureAtWork;
  //     break;
  //   default:
  //     adventure = adventureAtRandom;
  //   }

  adventure = adventureAtWork;

  // if (excerpt) {
  //   adventure += `"Here's an excerpt from a story where ${stats.name} is mentioned:"`;
  //   const sanitizedExcerpt = excerpt.replace(/"/g, '\\"');
  //   adventure += `"${sanitizePolygenString(sanitizedExcerpt)}"`;
  // }
  adventure += ';';
  adventure = await parsePolygenGrammar(adventure);
  adventure = parsePromptTags(adventure, character);
  // console.info(adventure);
  return adventure;
}

export function getCharacterHookPrompt(
  stats: RoleplayStats,
  backstory: string
) {
  return `
Read the following D&D adventure about an NPC called ${stats.name}, and create a one-line description about that character. Use words easy to understand even for a third grader.
Here are some examples of other one-line descriptions I have written already for other NPCs, to give you an idea of the format I need:

whose heart is broken
who is in search of a lost friend
who prefers to work naked
with a lot of friends
who experienced a trauma that scarred [them] profoundly
who is losing faith in [their] cause.

Use [their], [them] between square brackets to write pronouns related to the NPC. Use neutral pronouns all the times.

Here's the adventure: ${backstory}`;
}
// Start the sentence with "who", "whose" or "with", in lowercase, and then write rest of the description.

function parsePromptTags(prompt: string, character: Character) {
  return replaceTags(prompt, character)
    .map((part) => part.string)
    .join('');
}
