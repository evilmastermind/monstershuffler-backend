import { FastifyReply, FastifyRequest } from 'fastify';
import { handleError } from '@/utils/errors';
import { GenerateTextInput } from './ai.schema';
// @ts-expect-error old school import here
import plugin = require('@/plugins/polygen.js');

import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/** 
 * 
 * References:
 * OPENAI Stream API: https://platform.openai.com/docs/api-reference/streaming
 * Fastify SSEv2: https://github.com/mpetrunic/fastify-sse-v2
 * Client side EventSource: https://www.npmjs.com/package/@microsoft/fetch-event-source
 */

async function parsePolygenGrammar(grammar: string) {
  if (grammar.startsWith('S ::=')) {
    let parsedGrammar = grammar.trim();
    // replace next line with a space
    parsedGrammar = grammar.replace(/\n/g, ' ');
    return await plugin.Polygen.generate(parsedGrammar)();
  }
  return grammar;
}

export async function generateTextHandler(
  request: FastifyRequest<{ Body: GenerateTextInput }>,
  reply: FastifyReply
) {
  try {
    const body = request.body;
    let prompt = body?.prompt?.trim();

    // check if the prompt is a Polygen grammar (starts with "S ::=")
    prompt = await parsePolygenGrammar(prompt);
    if (prompt.startsWith('error:')) {
      console.log('Error:', prompt);
      return reply.code(400).send(prompt);
    }


    const stream = await openai.chat.completions.create({
      messages: [{ role: 'system', content: prompt }],
      // https://openai.com/api/pricing/
      // model: 'gpt-3.5-turbo-0125',
      model: 'gpt-4o',
      stream: true,
    });

    reply.sse((async function * source () {
      for await (const chunk of stream) {
        yield {
          id: chunk.id,
          data: chunk.choices[0]?.delta?.content || '',
        };
      }
    })());
    
    return;
  }
  catch (error) {
    console.log('Error:', error);
    return handleError(error, reply);
  }
}
