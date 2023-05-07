CHANGES TO OBJECTS

V actions should have variants inside of them which replace themselves at certain levels


V I should add a starting level to all stats, like skills, saving throws, bonuses, languages
const statObject = z.object({
  value: z.string(),
  levelMin: z.string().optional(),
});
  V skills
  V savingThrows
  X bonuses (2023/05/07 - this one can be done with expressions)
  V languages
  V resistances & stuff
  V subtypes
  ? types


V filtersObject/filters can't really be defined since it has unpredictable key names.
  replacing filtersObject with filters, since now each table will have its own
  choice solver service
  FROM:
  filtersObject: { someKeyName: 'someValue', someOtherKey: 'someOtherValue'}
  filtersObject: { someKeyName: ['value1','value2']}
  TO:
  filters: [
    { keyName: "someKeyName", keyValues: ['someValue'] },
    { keyName: "someOtherKey", keyValues: ['value1','value2'] },
  ]

V I have replaced the values inside 'chosenAlready' with ids... and spell arrays now have
  objects {id,name} instead of strings. Spell groups could have both random choices from
  the database and random choices from a list. List choices still use strings
  ==> lists now use ids instead of names


V addIdsToSpells might be incomplete (or some parts related to choices are not necessary
  because they are implemented elsewhere)


X if I let users create classes that use random choices, and those choices use ids which
  are only accessible to the creator, then other users will get an error if that class is
  published ==> you can only use official(user 0) stuff in lists and chosenAlready
  ==> (2023/05/07 - I decided to fill list and chosenAlready with both name and id)


V all enums (0,1)
  V swarm is now isSwarm
  V blind is now isBlind
  V canspeak is now canSpeak
  V enableGenerator is still enableGenerator
  V published is now isPublished
  V replaceName inside attacks

V getIdsFromNames

V all strings that should be numbers instead
  abilitiesLimit
  note Ismael 2023/05/05: some of these are strings because I might need to calculate them
  with expressions in the future
  V levelMin, levelMax, priority inside actions have been converted to number
  V some values inside choices


V spells:
FROM:
['Mage Hand', '...', ...]
TO:
[{id: 15125, name: "Mage Hand"}, {...}, ...]

V WARNING: there's a problem with spells: if they were to change name, the objects which were using them would still retain the old name
(maybe I can make an api call to retrieve the new names... and inside the editor I could create an "update spell names" button)

V alignment (npcs, races?, ???) should now be a tuple of 3 numbers instead of two, to include 'neutralness'


V AC shouldn't be an array but an object instead

V allow spellSlots ( I don't have to change anything, but I need to add a new boolean timesDayEach/slots)
  V I should actually move all related flags, groups and values inside a new object called spells
    spells: {
      hasSlots: true/false,
      ability: (spellCasting)
      groups: (spellSlots)
    }


V convert keys inside the main 'character' object 


V races => nameType should be an array, for races that have names that come from multiple groups, like half-elf, half-orc, etc.

V unit types: ft to meters, squares, etc. (note Ismael 2023/05/05. Every type is assumed to be the one used by WotC's manuals. Conversions will be implemented when generating the characters' statistics, or inside the editor when saving those values)


============
HOW TO DO IT
============
- create a list of all the places where you may find random choices
- parse every class, every race, every character and every template







the "ADVANCED" editor (current monstershuffler editor) and a "SIMPLER" editor should both coexist. 


ADVANCED EDITOR
===============
- all options available


SIMPLER EDITOR
==============
- many options hidden, expressions DISCOURAGED


NEW TOGGLE OPTION
=================
[o==] Calculate statistics automatically if there aren't expressions modifying them already.
