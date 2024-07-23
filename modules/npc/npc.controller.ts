import { Character } from '@/types';
import { FastifyReply, FastifyRequest } from 'fastify';
import { createRandomNpc } from './npc.controller.generator';
import type { PostBackstoryInput, PostRandomNpcInput } from './npc.schema';
import { handleError } from '@/utils/errors';
import { getRaceWithVariantsList } from '../race/race.service';
import { getClassWithVariantsList } from '../class/class.service';
import { getBackgroundList } from '../background/background.service';
import { getBackstory, getDnDAdventurePrompt } from './backstory';
import { generateTextStream } from '@/modules/ai/ai.service';
import crypto from 'crypto';

//////////////////////////////////////////////
// NPC TOKEN GENERATION AND VALIDATION
// This is used to verify that the NPC object
// hasn't been tampered with by the client,
// so that we can safely generate a backstory
// for it, save it to the database, and recycle
// it for other users.
//////////////////////////////////////////////

function createNpcToken(npc: Character) {
  const tokenProperties = { 
    race: npc.character?.race?.name,
    racevariant: npc.character?.racevariant?.name,
    class: npc.character?.class?.name,
    classvariant: npc.character?.classvariant?.name,
    background: npc.character?.background?.name,
    pronouns: npc.character?.pronouns,
    characterHook: npc.character?.characterHook,
    age: npc.character?.age,
    personality: npc.character?.trait,
    voice: npc.character?.voice,
  };

  const npcString = JSON.stringify(tokenProperties, Object.keys(tokenProperties).sort());
  const secretKey = process.env.JSON_SECRET;
  if (!secretKey) {
    throw new Error('Missing JSON_SECRET in .env');
  }
  return crypto.createHmac('sha256', secretKey).update(npcString).digest('hex');
}

function validateNpcToken(npc: Character, receivedToken: string) {
  const regeneratedToken = createNpcToken(npc);
  return crypto.timingSafeEqual(Buffer.from(regeneratedToken), Buffer.from(receivedToken));
}

//////////////////////////////////////////////
// CONTROLLER FUNCTIONS
//////////////////////////////////////////////

export async function createRandomNpcHandler(
  request: FastifyRequest<{ Body: PostRandomNpcInput }>,
  reply: FastifyReply
) {
  try {
    const npc = await createRandomNpc(request, reply);
    if (!npc?.npc) {
      throw new Error('Failed to create npc');
    }
    return {
      id: crypto.randomUUID(),
      token: createNpcToken(npc.npc),
      object: npc.npc,
    };
  } catch (error) {
    return handleError(error, reply);
  }
}

export async function createFourRandomNpcHandler(
  request: FastifyRequest<{ Body: PostRandomNpcInput }>,
  reply: FastifyReply
) {
  try {
    const npcs = [];
    for (let i = 0; i < 4; i++) {
      const npc = await createRandomNpc(request, reply);
      if (npc?.npc) {
        npcs.push({
          id: crypto.randomUUID(),
          token: createNpcToken(npc.npc),
          object: npc.npc
        });
      } else {
        throw new Error('Failed to create npc');
      }
    }
    return { npcs };
  } catch (error) {
    return handleError(error, reply);
  }
}

export async function getGeneratorDataHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { id } = request.user || { id: 0 };
    const racesWithVariants = await getRaceWithVariantsList(id);
    const classesWithVariants = await getClassWithVariantsList(id);
    const backgrounds = await getBackgroundList(id);
    return reply.code(200).send({
      races: racesWithVariants?.list || [],
      classes: classesWithVariants?.list || [],
      backgrounds: backgrounds || [],
    });
  } catch (error) {
    return handleError(error, reply);
  }
}

export async function generateBackstoryHandler(
  request: FastifyRequest<{ Body: PostBackstoryInput }>, 
  reply: FastifyReply
) {
  try {
    const body = request.body;
    const character = body.object;
    const token = body.token;

    // verify that the character hasn't been modified by the client
    if (!validateNpcToken(character, token)) {
      throw new Error('Invalid token');
    }

    // generate the backstory
    const backstoryPrompt = await getBackstory(character);
    let backstory = '';


    reply.sse((async function * source () {
      // start the stream for the backstory
      const excerptStream = await generateTextStream(backstoryPrompt, 'gpt-4o');
    
      for await (const chunk of excerptStream) {
        backstory += chunk.choices[0]?.delta?.content || '';
        yield {
          id: chunk.id,
          data: chunk.choices[0]?.delta?.content || '',
        };
      }

      const adventurePrompt = await getDnDAdventurePrompt(character, backstory);
      // start the stream for the adventure module
      const adventureStream = await generateTextStream(adventurePrompt, 'gpt-4o');

      for await (const chunk of adventureStream) {
        backstory += chunk.choices[0]?.delta?.content || '';
        yield {
          id: chunk.id,
          data: chunk.choices[0]?.delta?.content || '',
        };
      }

    })());

    const c = character.character;

    if (!c.user) {
      c.user = {};
    }
    c.user.backstory = { string: backstory };


    return;
    
  } catch (error) {
    return handleError(error, reply);
  }
}
