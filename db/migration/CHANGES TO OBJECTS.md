CHANGES TO OBJECTS

- actions should have variants inside of them which replace themselves at certain levels


- I should add a starting level to all stats, like skills, saving throws, bonuses, languages
const statObject = z.object({
  value: z.string(),
  levelMin: z.string().optional(),
});
subtypes
types


- filtersObject can't really be defined since it has unpredictable key names.
FROM:
filtersObject: { someKeyName: 'someValue', someOtherKey: 'someOtherValue'}
filtersObject: { someKeyName: ['value1','value2']}
TO:
filtersObject: [
	{ keyName: "someKeyName", keyValues: ['someValue'] },
	{ keyName: "someOtherKey", keyValues: ['value1','value2'] },
]


- all enums (0,1)


- all strings that should be numbers instead
abilitiesLimit

- spells:
FROM:
['Mage Hand', '...', ...]
TO:
[{id: 15125, name: "Mage Hand"}, {...}, ...]


- everything that can't be expanded in the future (like things that aren't objects, I can't add keys to them)


- allow spellSlots


- think about how you're going to add automatic CR calculations and which keys you should add to the objects





============
HOW TO DO IT
============
- create a list of all the plases in which you may find random choices
- parse every class, every race, every character and every template


- races => nameType should be an array, for races that have names that come from multiple groups, like half-elf, half-orc, etc.


- unit types: ft to meters, squares, etc.



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
