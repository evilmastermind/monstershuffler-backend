import plugin = require('@/plugins/polygen.js');


export async function parsePolygenGrammar(grammar: string) {
  let parsedGrammar = grammar.trim();
  if (!parsedGrammar.startsWith('S ::=')) {
    throw new Error('error: grammar must start with "S ::="');
  }
  // replace next line with a space
  parsedGrammar = grammar.replace(/\n/g, ' ');
  try {
    // @ts-expect-error there is no type for Polygen
    return await plugin.Polygen.generate(parsedGrammar)();
  } catch (error) {
    throw new Error(`error: ${error}`);
  }
}

export function sanitizePolygenString(input: string) {
  let output = '';
  output = replaceAccentCharacters(input);
  const allowedCharacters = /[^A-Za-z0-9\s()\-_?.,!:\\&#+*/%$�[\]{}~@;:|<>=^'""áéíóúàèìòùäëïöüâêîôûãñõ]/g;
  return output.replace(allowedCharacters, '');
}


export function replaceAccentCharacters(input: string) {
  return input.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}
