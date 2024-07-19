// @ts-expect-error old school import here
import plugin = require('@/plugins/polygen.js');


export async function parsePolygenGrammar(grammar: string) {
  let parsedGrammar = grammar.trim();
  if (!parsedGrammar.startsWith('S ::=')) {
    throw new Error('error: grammar must start with "S ::="');
  }
  // replace next line with a space
  parsedGrammar = grammar.replace(/\n/g, ' ');
  return await plugin.Polygen.generate(parsedGrammar)();
}

export function sanitizePolygenString(input: string) {
  const allowedCharacters = /[^A-Za-z0-9\s()\-_?.,!:\\&#+*/%$�[\]{}~@;:|<>=^'""]/g;
  return input.replace(allowedCharacters, '');
}
