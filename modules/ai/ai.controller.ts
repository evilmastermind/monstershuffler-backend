import { FastifyReply, FastifyRequest } from 'fastify';
import { handleError } from '@/utils/errors';
import { GenerateTextInput, CURRENT_CHEAP_MODEL } from './ai.schema';
import { generateTextStream } from './ai.service';
import { parsePolygenGrammar } from '@/modules/polygen/polygen.service';

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
    const model = body?.model || CURRENT_CHEAP_MODEL;
    let prompt = body?.prompt?.trim();

    // check if the prompt is a Polygen grammar (starts with "S ::=")
    prompt = await parsePolygenGrammar(prompt);
    if (prompt.startsWith('error:')) {
      console.error('Error:', prompt);
      return reply.code(400).send(prompt);
    }

    const stream = await generateTextStream(prompt, model);

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
    console.error('Error:', error);
    return handleError(error, reply);
  }
}
