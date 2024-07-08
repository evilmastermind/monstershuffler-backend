import { FastifyReply, FastifyRequest } from 'fastify';
import { handleError } from '@/utils/errors';
import { GenerateTextInput } from './ai.schema';
import {on} from 'events';

import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/** 
 * 
 * References:
 * OPENAI Stream API: https://platform.openai.com/docs/api-reference/streaming
 * Fastify SSEv2: https://github.com/mpetrunic/fastify-sse-v2
 * Client side EventSource: https://www.npmjs.com/package/@microsoft/fetch-event-source
 */

export async function generateTextHandler(
  request: FastifyRequest<{ Body: GenerateTextInput }>,
  reply: FastifyReply
) {
  try {
    const body = request.body;
    const { prompt } = body;

    const stream = await openai.chat.completions.create({
      messages: [{ role: 'system', content: prompt }],
      // https://openai.com/api/pricing/
      // model: 'gpt-3.5-turbo-0125',
      model: 'gpt-4o',
      stream: true,
    });

    reply.sse((async function * source () {
      for await (const chunk of stream) {
        console.log('chunk', chunk);
        yield {
          id: chunk.id,
          data: chunk.choices[0]?.delta?.content || '',
        };
      }
    })());
    
    return;
  }
  catch (error) {
    return handleError(error, reply);
  }
}
