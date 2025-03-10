import OpenAI from 'openai';


const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });


/**
 * Generate text using the OpenAI API.
 * Available models: https://openai.com/api/pricing/
 **/
export async function generateTextStream(prompt: string, model = 'gpt-4o-mini', temperature = 1) {
  return await openai.chat.completions.create({
    messages: [{ role: 'system', content: prompt,  }],
    model: model,
    stream: true,
    temperature: temperature,
  });
}

export async function generateText(prompt: string, model = 'gpt-4o-mini', temperature = 1) {
  return await openai.chat.completions.create({
    messages: [{ role: 'system', content: prompt,  }],
    model: model,
    temperature: temperature,
  });
}

export async function createThread() {
  return await openai.beta.threads.create();
}

export async function queryAssistant(assistant_id: string, request: string) {
  const thread = await openai.beta.threads.create({
    messages: [
      {
        role: 'user',
        content: request
      }
    ]
  });
  
  const run = await openai.beta.threads.runs.create(thread.id, {
    assistant_id
  });

  let status = run.status;

  while (status === 'queued' || status === 'in_progress') {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const updatedRun = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    status = updatedRun.status;
  }

  if (status === 'completed') {
    const messages = await openai.beta.threads.messages.list(thread.id);
    console.log(messages.data[0].content);
  } else {
    console.error('Failed to query assistant.');
  }
}
