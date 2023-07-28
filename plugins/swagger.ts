import { version } from '../package.json';

export default {
  openapi: {
    info: {
      title: 'Monstershuffler API',
      description: 'REST API for monstershuffler.com',
      version,
    },
    tags: [
      { name: 'users', description: "The users' account. " },
      // { name: 'actions', description: 'Retrieve the official actions of srd monsters, classes and races to build your creatures faster. Save your custom actions and share them with other users.' },
      // { name: 'armor', description: 'The different types of armor that can be worn by characters.' },
      {
        name: 'backgrounds',
        description:
          "Backgrounds are a way to define a character's occupation, like a soldier, a merchant, a priest, etc. and give them minor abilities related to that occupation. They are usually given to NPCs in place of classes.",
      },
      // { name: 'characterhooks', description: 'Tiny snippets of lore to provide a snapshot of a character's identity or story.' },
      // { name: 'characters', description: 'Any type of Dungeons & Dragons creature, like Monsters, NPCs, Player Characters, etc.' },
      {
        name: 'classes',
        description:
          "Classes are the main way to define a character's role in the game. They define what abilities the character has and how they can use them.",
      },
      // { name: 'class variants', description: 'Class variants can be subclasses, archetypes, variants or customizations that add new features on top of their base class.' },
      // { name: 'damage types', description: 'Damage types are the different types of damage that can be dealt by weapons, spells, and other effects.' },
      // { name: 'folders', description: 'Folders are a way to organize your characters, actions, etc. into groups.' },
      // { name: 'languages', description: 'Languages are the different ways that characters can communicate with each other.' },
      // { name: 'names', description: 'A collection of names for your characters, divided into different categories.' },
      {
        name: 'npcs',
        description: 'Tools to generate non-player-characters (NPCs).',
      },
      // { name: 'quirks', description: 'Quirks are small, random snippets of lore that can be added to your characters for roleplay purposes.' },
      {
        name: 'races',
        description:
          "A race defines the innate abilities derived from a character's fantasy ancestry.",
      },
      // { name: 'race variants', description: 'Race variants, or subraces, further define a character\'s ancestry by adding new features on top of their base race.' },
      // { name: 'reports', description: 'Suggestions, complaints or bug reports made by users.' },
      // { name: 'skills', description: 'Skills are abilities that characters can use to perform certain tasks.' },
      // { name: 'spells', description: 'Spells are magical abilities that characters can use to perform certain tasks.'},
      // { name: 'surnames', description: 'A collection of surnames for your characters, divided into different categories.' },
      // { name: 'templates', description: 'Templates are \'bundles of statistics\' that can be added to characters to turn them into something different, like a Werefolf, a Zombie, or a Fire creature.' },
      // { name: 'traits', description: 'Traits are  mostly adjectives describing a creature\'s state of mind, attitude, core beliefs or current feelings.' },
      // { name: 'weapons', description: 'Different types of weapons that can be used to better define characters\'s actions.'}
    ],
  },
};
