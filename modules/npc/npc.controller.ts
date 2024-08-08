import { Character } from '@/types';
import { FastifyReply, FastifyRequest } from 'fastify';
import { createRandomNpc } from './npc.controller.generator';
import type { GenerateBackstoryInput, PostRandomNpcInput, PostRandomNpcResponse } from './npc.schema';
import { handleError } from '@/utils/errors';
import { getRaceWithVariantsList } from '../race/race.service';
import { getClassWithVariantsList } from '../class/class.service';
import { getBackgroundList } from '../background/background.service';
import { getBackstory, getDnDAdventurePrompt, parseRoleplayStats } from './backstory';
import { generateTextStream } from '@/modules/ai/ai.service';
import { getRecycledNpcsForUser, getNpc, postNpc, addNpcToSentAlreadyList, addBackstoryToNpc } from './npc.service';

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
      id: new Date().getTime(), // TODO: replace this with a real id
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
    let npcs: PostRandomNpcResponse[] = [];
    const id = request.user?.id;
    const sessionid = request.body?.sessionId;

    const NPCS_TO_GENERATE = 4;

    // get recycled npcs for the user
    npcs = npcs.concat(await getRecycledNpcsForUser(request, NPCS_TO_GENERATE, id, sessionid));
    const npcsRemaining = NPCS_TO_GENERATE - npcs.length;

    for (let i = 0; i < npcsRemaining; i++) {
      const npc = await createRandomNpc(request, reply);
      if (npc?.npc) {
        /*
        Saving the npc into the database.
        If the user wants to generate a backstory for the npc,
        we will retrieve the "clean" npc object from the database,
        to avoid malicious tampering with the object's data
        */
        const result = await postNpc({
          userid: id,
          sessionid,
          object: npc.npc
        });
        // user's choices
        if (!request.body.addVoice) {
          delete npc.npc.character.voice;
        }
        if (!request.body.includeBodyType) {
          delete npc.npc.character.weight;
          delete npc.npc.character.height;
        }
        npcs.push({
          id: result.id,
          object: npc.npc
        });
      } else {
        throw new Error('Failed to create npc');
      }
    }
    npcs.forEach((npc)=> {
      addNpcToSentAlreadyList({
        npcid: npc.id,
        userid: id,
        sessionid
      });
    });
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
  request: FastifyRequest<{ Body: GenerateBackstoryInput }>, 
  reply: FastifyReply
) {
  try {
    const body = request.body;
    const npcid = body.id;

    const { id } = request.user || { id: undefined };

    // retrieving the "clean" npc object from the database
    const npc = await getNpc(npcid);

    if (!npc) {
      throw new Error('NPC not found');
    }
    if (npc.hasbackstory === true) {
      throw new Error('It\'s currently possible to generate a backstory only once for an NPC');
    }

    const roleplayStats = await parseRoleplayStats(npc.object as Character);

    // generate the backstory
    const backstoryPrompt = await getBackstory(npc.object as Character, roleplayStats);
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

      const adventurePrompt = await getDnDAdventurePrompt(npc.object as Character, roleplayStats, backstory);
      // start the stream for the adventure module
      const adventureStream = await generateTextStream(adventurePrompt, 'gpt-4o');

      for await (const chunk of adventureStream) {
        backstory += chunk.choices[0]?.delta?.content || '';
        yield {
          id: chunk.id,
          data: chunk.choices[0]?.delta?.content || '',
        };
      }

      addBackstoryToNpc({
        id: npcid,
        backstory,
        object: npc.object as Character
      });

    })());

    return;
    
  } catch (error) {
    return handleError(error, reply);
  }
}
