// @ts-expect-error old school import here
import plugin = require('@/plugins/polygen.js');
import crypto from 'crypto';


export async function parsePolygenGrammar(grammar: string) {
  let parsedGrammar = grammar.trim();
  if (!parsedGrammar.startsWith('S ::=')) {
    throw new Error('error: grammar must start with "S ::="');
  }
  // replace next line with a space
  parsedGrammar = grammar.replace(/\n/g, ' ');
  try {
    return await plugin.Polygen.generate(parsedGrammar)();
  } catch (error) {
    throw new Error(`error: ${error}`);
  }
}

export function sanitizePolygenString(input: string) {
  const allowedCharacters = /[^A-Za-z0-9\s()\-_?.,!:\\&#+*/%$�[\]{}~@;:|<>=^'""áéíóúàèìòùäëïöüâêîôûãñõ]/g;
  return input.replace(allowedCharacters, '');
}
