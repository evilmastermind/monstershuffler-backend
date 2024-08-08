import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });


/**
 * Generate text using the OpenAI API.
 * Available models: https://openai.com/api/pricing/
 **/
export async function generateTextStream(prompt: string, model = 'gpt-3.5-turbo-0125', temperature = 1) {
  return await openai.chat.completions.create({
    messages: [{ role: 'system', content: prompt,  }],
    model: model,
    stream: true,
    temperature: temperature,
  });
}
