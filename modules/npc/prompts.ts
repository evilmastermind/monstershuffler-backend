import { replaceTags, random, createStats } from 'monstershuffler-shared';
import { parsePolygenGrammar, sanitizePolygenString } from '@/modules/polygen/polygen.service';
import type { Character } from 'monstershuffler-shared';

async function getAlignmentDescription(alignment: string, character: Character) {
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
    description =  `S ::= 
  "[Name] is a free spirit who follows [his] own whims, with disregard for the law" |
  "[Name] is a rebel who fights rules and restrictions" |
  "[Name] is a wild card who follows [his] own path, no matter where it leads" |
  "[Name] does whatever [he] wants, whenever [he] wants, with no regard for the consequences" |
  "[Name] is a force of chaos in the world, who follows [his] own whims and desires"
  ;`;
    break;
  case 'Lawful Evil':
    description =  `S ::=
  "[Name] seeks power and control, and will hurt others to get it. [He] follows a strict code of conduct" |
  "[Name] is a tyrant who rules with an iron fist, and will do whatever it takes to maintain power" |
  "[Name] is a ruthless dictator who will stop at nothing to achieve [his] goals" |
  "[Name] is a villain who believes in order and structure, and will do whatever it takes to maintain it" |
  "[Name] oppresses others to maintain order and control, and will do whatever it takes to achieve [his] goals"
  "[Name] is willing to hurt others to get what [he] wants, but follows a strict code of conduct"
  ;`;
    break;
  case 'Neutral Evil':
    description =  `S ::=
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
    description =  'S ::= "[Name] can fit into any alignment, depending on the situation";';
    break;
  case 'Unaligned':
    description =  'S ::= "[Name] doesn\'t feel strongly one way or the other about morality";';
    break;
  case 'Any Good':
  case 'Good':
    description =  'S ::= "[Name] is a force for good in the world";';
    break;
  case 'Any Evil':
  case 'Evil':
    description =  'S ::= "[Name] is a force for evil in the world";';
    break;
  case 'Any Lawful':
  case 'Lawful':
    description =  'S ::= "[Name] believes in order and structure";';
    break;
  case 'Any Chaotic':
  case 'Chaotic':
    description =  'S ::= "[Name] believes in personal freedom and self-expression";';
    break;
  case 'Any Neutral':
    description =  'S ::= "[Name] is a neutral force in the world";';
    break;
  default:
    description =  'S ::= "[Name] has no inclination towards any alignment";';
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

function getInvolvmentInTheAdventure(alignment: string) {
  if (alignment.includes('Good')) {
    return 'needs help to prevent it and should be considered an ally';
  }
  if (alignment.includes('Evil')) {
    return 'is behind it and should be considered an enemy';
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
  characterHook: string;
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
  voice: string;
  involvment: string;
  cause: string;
};

export async function parseRoleplayStats(character: Character): Promise<RoleplayStats> {
  const s = character.statistics;
  const t = character.tags;

  if (!t || !s) {
    throw new Error('Character tags or statistics are missing');
  }

  const name = '[Name]';
  const fullName = '[Fullname]';
  let gender = '';
  if (s.pronouns === 'neutral') {
    gender = 'nonbinary (use they/them pronouns)';
  } else if (s.pronouns === 'thing') {
    gender = 'No gender (use it/its pronouns)';
  } else {
    gender = s.pronouns;
  }
  const race = s.race || '';
  let characterHook = '';
  if ('characterHook' in s && s.characterHook) {
    characterHook = s.characterHook.map((hook) => hook.string).join('');
  }
  const classDetails = character.character.classvariant? getArchetypeDescription(
    character.character.classvariant?.name
  ) : '';
  let professionDetails = ''; 
  if (character.character?.background) {
    professionDetails = `${character.character?.background?.name} (${character.character?.background?.description})`;
  }
  const armor = s?.AC?.name || '';
  const weapons = s?.actions?.filter((action)=> action.string.includes('Attack'))?.map((action)=> action.name).join(', ') || '';
  const age = `${s.age || 'unspecified'}`;
  const stats = `${s.abilities.STR.name}: ${s.abilities.STR.number}, ${s.abilities.DEX.name}: ${s.abilities.DEX.number}, ${s.abilities.CON.name}: ${s.abilities.CON.number}, ${s.abilities.INT.name}: ${s.abilities.INT.number}, ${s.abilities.WIS.name}: ${s.abilities.WIS.number}, ${s.abilities.CHA.name}: ${s.abilities.CHA.number}`;
  const bodyType = s.bodyType || '';
  const height = character.character?.height?.toString() || '';
  const simpleAlignment = `${getSimpleAlignmentDescription(s.alignment.string)}`;
  const alignment = await getAlignmentDescription(s.alignment.string, character);
  const personality = s.personality? `${s.personality.name} (${s.personality.description})` : '';
  const voice = s.voice || '';
  const involvment = getInvolvmentInTheAdventure(s.alignment.string);
  const cause = await parsePolygenGrammar(`

S ::= (- Relationship |++ Monster from the game "Dungeons and Dragons 5th edition" | Event | deity | Organization | Magicalstuff );

Magicalstuff ::= (Magical Wearable | Magical Weapon | Magical Anomaly | Magical Item | Magical Instrument);
Magical ::= (enchanted | magical | cursed |-- sentient |-- haunted |- blessed);
Wearable ::= (Jewelery |  Clothing | Armor | Hats);
Jewelery ::= (amulet | brooch | earring | medallion | necklace | ring | trinket);
Clothing ::= (blouse | boots | belt | bracers | bracelets | cape | cloak | cuirass | dress | gauntlet | goggles | gloves | helm | helmet | kilt | lenses | monocle | lingerie | loincloth | mask | mantle | mittens | pants | pajamas | sandals | sashscarf | shawl | shirt | shoes | shorts | skirt | socks | stockings | trousers | vest | underwear | thong | scepter | cane);
Armor ::= (breastplate armor | chain mail armor | chain shirt | half plate armor | hide armor | leather armor | padded armor | plate armor | ring mail armor |+ (robe | tunic) | scale mail armor |+ shield | studded leather armor);
Hats ::= (bandana | hat | cap | fez | turban | headband | fedora | cowboy hat | sombrero | top hat | cloche hat | mitre | bonnet | hood | tiara | crown);
Weapon ::= (sword | dagger | axe | mace | hammer | staff | wand | bow | crossbow | sling | spear | lance | halberd | scythe | flail | whip | club | trident | javelin | blowgun | net | truncheon | glaive | pike | rapier | scimitar | longsword | shortsword | greatsword | handaxe | battleaxe | warhammer | maul | quarterstaff | light crossbow | heavy crossbow | shortbow | longbow | sling | spear | lance | halberd | scythe | flail | whip | club | trident | javelin | blowgun | net | truncheon | glaive | pike | rapier | scimitar | longsword | shortsword | greatsword | handaxe | battleaxe | warhammer | maul | quarterstaff | light crossbow | heavy crossbow | shortbow | longbow | catapult |- cannon |-- trebuchet );
Anomaly ::= ( portal | rift | anomaly | time distortion | pit | disturbance | zone );
Item ::= (Adventuringgear | Valuables | Furniture |-- Transportation | Tools);
Adventuringgear ::= (bag | backpack | +book | tome | candle | chain | holster | hourglass | lamp | lantern | map | pouch | quiver | rope | sack | satchel | tent | torch | lockpick);
Valuables ::= (coin | crystal | gem | key | orb | + potion | relic | scepter | painting | + scroll | (statue | statuette | figurine));
Furniture ::= (barrel | bottle | bauble | bowl | bucket | carpet | cauldron | chair | chalice | chest | crate | cup | door | fireplace | fork | goblet | jar | jug | kettle | pan | plate | banner | pedestal | flag | rod | rug | saucer | spoon | stove | tapestry | vase);
Transportation ::= ([--flying] (boat | ship | galleon) | chariot | cart | carriage);
Tools ::= (abacus | pen | quill | ink | rake | scythe | shovel | spade | stick | wheelbarrow | hammer | sledgehammer | scissors | pocket knife | saw | paperclip | pliers | wrench | chisel);
Monster ::= ( homunculus | lemure | shrieker | kobold | merfolk | stirge | aarakocra | dretch | drow | flying sword | goblin | grimlock | pseudodragon | pteranodon | skeleton | sprite | steam mephit | violet fungus | zombie | cockatrice | darkmantle | dust mephit | gnoll | svirfneblin | gray ooze | hobgoblin | ice mephit | lizardfolk | magma mephit | magmin | orc | rust monster | sahuagin | satyr | shadow | warhorse skeleton | animated armor | brass dragon wyrmling | bugbear | copper dragon wyrmling | dryad | duergar | ghoul | harpy | hippogriff | imp | quasit | specter | allosaurus | ankheg | azer | black dragon wyrmling | bronze dragon wyrmling | centaur | ettercap | gargoyle | gelatinous cube | ghast | gibbering mouther | green dragon wyrmling | grick | griffon | merrow | mimic | minotaur skeleton | ochre jelly | ogre | ogre zombie | pegasus | plesiosaurus | rug of smothering | sea hag | wererat | white dragon wyrmling | will o wisp | silver dragon wyrmling | ankylosaurus | basilisk | bearded devil | blue dragon wyrmling | doppelganger | green hag | hell hound | manticore | minotaur | mummy | nightmare | owlbear | werewolf | wight | gold dragon wyrmling | black pudding | chuul | couatl | ettin | ghost | lamia | red dragon wyrmling | succubus | incubus | wereboar | weretiger | air elemental | barbed devil | bulette | earth elemental | fire elemental | flesh golem | gorgon | hill giant | night hag | otyugh | roper | salamander | shambling mound | triceratops | troll | unicorn | vampire spawn | water elemental | werebear | wraith | xorn | chimera | drider | invisible stalker | medusa | vrock | wyvern | young brass dragon | young white dragon | oni | shield guardian | stone giant | young black dragon | young copper dragon | chain devil | cloaker | frost giant | hezrou | hydra | spirit naga | tyrannosaurus rex | young bronze dragon | young green dragon | bone devil | clay golem | cloud giant | fire giant | glabrezu | treant | young blue dragon | young silver dragon | aboleth | deva | guardian naga | stone golem | young red dragon | young gold dragon | behir | djinni | efreeti | gynosphinx | horned devil | remorhaz | roc | erinyes | adult brass dragon | adult white dragon | nalfeshnee | rakshasa | storm giant | vampire | adult black dragon | adult copper dragon | ice devil | adult bronze dragon | adult green dragon | mummy lord | purple worm | adult blue dragon | iron golem | marilith | planetar | adult silver dragon | adult red dragon | androsphinx | dragon turtle | adult gold dragon | balor | ancient brass dragon | ancient white dragon | pit fiend | ancient black dragon | ancient copper dragon | lich | solar | ancient bronze dragon | ancient green dragon | ancient blue dragon | kraken | ancient silver dragon | ancient red dragon | ancient gold dragon | tarrasque );
Instrument ::= (++lute | flute | drum | harp | lyre | horn | trumpet | violin | cello | bagpipes | "hurdy gurdy" | accordion | harmonica | tambourine | triangle | maracas | cymbals | gong | drumset | bass guitar | guitar | banjo | mandolin | ukulele | bongo | harmonica | harp | harpsichord | piano);
Socialevent ::= ( festival | celebration | ritual | ceremony | battle | war | skirmish | duel | competition | contest | battle | war | rebellion | revolution | uprising | coup | assassination );
Naturalevent ::= ( aurora | avalanche | blizzard | cold snap | comet | drought | earthquake | eclipse | flood | fog | hailstorm | heatwave | hurricane | meteor shower | mist | rainbow | rainstorm | sandstorm | snowfall | storm | thunderstorm | tornado | tsunami | volcanic eruption | wildfire );
Event ::= ( Naturalevent | Socialevent );
Organization ::= ( guild | order | brotherhood | sisterhood | cult | sect | cabal | coven | circle | society | club | association | league | alliance | coalition | confederation | federation | corporation | company | business | firm | enterprise | consortium | syndicate | cartel | foundation | charity | institute | academy | university | school | college | seminary | fraternity | sorority | council | committee | board of directors | commission | agency | bureau | department | administration | government | regime | political authority | business corporation | company | bandit gang | criminal organization | thieves guild | assassins guild | mercenary company | military order | knightly order | religious order | secret society);
Relationship ::= ( betrayal | (unrequited | forbidden | secret) love | love triangle | (arranged | political | forced) marriage | (estranged | lost) family | rival | enemy | gamble | loan | kidnapping | extortion | blackmail | torture);
  `);

  const location = await parsePolygenGrammar(`

S ::= Locationstatus Locationtype ;

Locationstatus ::= [ abandoned | ancient | cursed | haunted | hidden | lost | magical | mysterious | sacred | secret | strange | unknown | unexplored | uninhabited | unfinished | forgotten | forbidden | hidden ];
Locationtype ::= ( castle | fortress | tower | keep | palace | temple | cathedral | shrine | church | monastery | abbey | library |- university | school | academy | guildhall | inn | tavern | pub | market | bazaar | fair | festival | carnival | circus | theater | opera house | concert hall | amphitheater | stadium | arena | coliseum | bathhouse | brothel | prison | jail | dungeon | catacombs | sewers | crypt | graveyard | cemetery | mausoleum | tomb | pyramid | ziggurat | obelisk | statue | monument | fountain | well | spring | river | lake | pond | waterfall | stream | brook | canal | aqueduct | bridge | causeway | road | highway | path | trail | street | alley | lane | square | plaza | park | garden | woods | bog | moor | heath | glacier | valley | canyon | cave | cavern | grotto | mine | battlefield);

  `);
  const environment = await parsePolygenGrammar(`
S ::= (+(city | town | village | hamlet) | arctic | forest | underdark | desert | mountain | swamp | jungle |-- (sea | ocean)| coastal | grassland | savannah | wasteland | tundra );
`);

  const roleplayStats: { [key: string]: string } = {
    name,
    fullName,
    gender,
    race,
    characterHook,
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


export async function getPhysicalAppearancePrompt(character: Character, stats: RoleplayStats) {
  if (!character.statistics) {
    createStats(character);
  }
  const prompt = `
  Describe the physical appearance of an NPC in a Dungeons & Dragons adventure in up to 70 words.
  Focus on their looks, expression, clothing, and any other notable details.
  Avoid mentioning their name, alignment, profession, magical abilities, or nature.
  When possible, vary ethnicities based on the NPC's race.
  [His] name is ${stats.name}, 
  [He] is a ${stats.age} ${stats.gender} ${stats.race}.
  ${stats.bodyType? `[His] body type is ${stats.bodyType}, [his] height is ${stats.height || 'average'}.` : ''}
  [His] ability scores will tell you [his] physical and mental prowess (or weaknesses): ${stats.stats}.
  ${stats.armor? `[His] armor is ${stats.armor}.` : ''}
  ${stats.weapons? `[He] fights using ${stats.weapons}.` : ''}
  Profession details: ${describeCharacterProfession(stats.classDetails, stats.professionDetails)}.
  [His] defining personality trait is ${stats.personality}, and ${stats.alignment}.;
  `;
  return parsePromptTags(prompt, character);
}

function describeCharacterProfession(classDetails?: string, professionDetails?: string): string {
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

export async function getBackstoryPrompt(character: Character, stats: RoleplayStats) {
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
"- This character is defined, by the community, by the following character hook: ${sanitizePolygenString(stats.characterHook)}"
"- the tabloid will speculate about why people think that way about the character"
"- provide one possible cause, which is tied to a ${stats.cause}, and give proof of it in the excerpt"
"- do not mention the character hook directly, or the character's traits but hint at them, just be inspired by them"
"- avoid including rituals or similar elements in the excerpt. Simply focus on [His] profession"
"- additional details about the character: "
"[His] name is ${stats.name}, "
"[He] is a ${stats.age} ${stats.gender} ${stats.race}."
"Profession details: ${describeCharacterProfession(stats.classDetails, stats.professionDetails)}."
"[His] defining personality trait is '${stats.personality}', and ${stats.alignment}. ";
`;
  return parsePromptTags(backstory, character);
}

async function getExcerptPrompt(character: Character, stats: RoleplayStats) {
  const backstory = `S ::=
  "Write an excerpt from an imaginary fantasy novel, in markdown format."
  "- do not write any title"
  "- start with ...a truncated sentence, as if the excerpt was extracted randomly from the novel"
  "- also end with a truncated sentence..."
  "- only write the excerpt, no other text must be included (no title, no author, no ending line, etc.)"
  "- make the excerpt around 100 words long"
  "- this excerpt comes from a chapter in which a character of the book has" ([his] most defining moment in the novel | a significative interaction with another character | an ordinary moment in [his] life | a moment in [his] daily job | a moment where [he] makes an important decision )
  "- This moment, and the character, are defined by the following character hook: ${sanitizePolygenString(stats.characterHook)}"
  "- Tie the character to a ${stats.cause} in the excerpt, and make it the reason for the character's actions or feelings or thoughts"
  "- do not mention the character hook directly, or the character's traits, but hint at them, just be inspired by them"
  "- Avoid including rituals or similar elements in the excerpt. Simply focus on [His] profession"
  "- additional details about the character: "
  "[His] name is ${stats.name}, "
  "[He] is a ${stats.age} ${stats.gender} ${stats.race}."
  "Profession details: ${describeCharacterProfession(stats.classDetails, stats.professionDetails)}."
  "[His] defining personality trait is ${stats.personality}, and ${stats.alignment}.";
  `;
  return parsePromptTags(backstory, character);
}

export async function getDnDAdventurePrompt(character: Character, stats: RoleplayStats, excerpt = '') {
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
  ## Adventure idea: [write the name of the adventure]
  [write an introduction]
  ### Secret 1: [write a title for the secret]
  [write a description of the secret].
  [repeat for at least 4 secrets]
  ### Climax: [write a name for the climax of the adventure]
  [write the climax description and conclusion]."
  "Secrets are steps which define a linear path that the player characters playing the adventure will follow to complete the adventure, by discovering pieces of the story until they reach the final climax. The first secret should be about who hired the adventurers or what drove them to investigate."
  "The adventure will revolve around an an NPC and [his] profession."
  "The player characters will be hired to solve an issue or threat that will be strictly related to the NPC's profession, and will have to investigate the situation to find out what is happening before things get worse."
  "Whatever threat or issue the player characters are trying to solve, ${stats.name} ${stats.involvment}."
  "Make sure to include" (++ a "${stats.cause}" | a "${stats.location} as one of the locations" | "${stats.environment} as one of the locations" ) "in the adventure."
  "Use also the NPC's character hook to shape the adventure."
  ["If the NPC's profession is not related to magic, AVOID INCLUDING ANY MAGIC OR SPELLS IN THE ADVENTURE. This is very important, because the adventure must focus on the NPC's profession and the issue at work."]
  "The NPC which is going to be the cue for the adventure is the following"
  "${stats.name} is a ${stats.age} ${stats.gender} ${stats.race}."
  "Profession details: ${describeCharacterProfession(stats.classDetails, stats.professionDetails)}."
  "Character hook: ${stats.characterHook}"
  "[His] defining personality trait is '${stats.personality}', and ${stats.alignment}. "
  "Create other NPCs if necessary"
  `;
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
  adventure = parsePromptTags(adventure, character);
  adventure = await parsePolygenGrammar(adventure);
  // console.info(adventure);
  return adventure;
}

export function getCharacterHookPrompt(stats: RoleplayStats, backstory: string) {
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
