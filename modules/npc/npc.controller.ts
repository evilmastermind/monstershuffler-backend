import { PrismaClient } from '@prisma/client';
import { Character } from '@/types';
import { FastifyReply, FastifyRequest } from 'fastify';
import { createRandomNpc } from './npc.controller.generator';
import type {
  GenerateBackstoryBody,
  PostRandomNpcBody,
  PostRandomNpcResponse,
  PostNpcRatingBody,
} from './npc.schema';
import { handleError } from '@/utils/errors';
import { getRaceWithVariantsList } from '../race/race.service';
import { getClassWithVariantsList } from '../class/class.service';
import { getBackgroundList } from '../background/background.service';
import {
  getDnDAdventurePrompt,
  parseRoleplayStats,
  type RoleplayStats,
  getCharacterHookPrompt,
  getPhysicalAppearancePrompt,
} from './prompts';
import { generateTextStream, generateText } from '@/modules/ai/ai.service';
import { postAnswer } from '../feedback/feedback.service';
import {
  CURRENT_CHEAP_MODEL,
  CURRENT_GOOD_MODEL,
} from '@/modules/ai/ai.schema';
import {
  getRecycledNpcsForUser,
  getNpcForUpdate,
  postNpc,
  addNpcToSentAlreadyList,
  addBackstoryToNpc,
  postNpcRating,
  getNpc,
  updateNpcBackstoryStatus,
} from './npc.service';
import { calculateCharacterHook } from 'monstershuffler-shared';
import { generateBackstorySentences } from './backstory';
import prisma from '@/utils/prisma';

//////////////////////////////////////////////
// CONTROLLER FUNCTIONS
//////////////////////////////////////////////

// export async function createRandomNpcHandler(
//   request: FastifyRequest<{ Body: PostRandomNpcBody }>,
//   reply: FastifyReply
// ) {
//   try {
//     const npc = await createRandomNpc(request, reply);
//     if (!npc?.npc) {
//       throw new Error('Failed to create npc');
//     }
//     return {
//       id: new Date().getTime(), // TODO: replace this with a real id
//       object: npc.npc,
//     };
//   } catch (error) {
//     return handleError(error, reply);
//   }
// }

export async function createFourRandomNpcHandler(
  request: FastifyRequest<{ Body: PostRandomNpcBody }>,
  reply: FastifyReply
) {
  try {
    let npcs: PostRandomNpcResponse[] = [];
    const id = request.user?.id;
    const sessionid = request.body?.sessionId;

    // check if the generator (prompt mode) couldn't find some keywords written by the user
    const wordsNotFound = [...new Set(request.body.wordsNotFound || [])].filter(
      (word) => word.length > 0
    );
    reportWordsNotFound(wordsNotFound, id, sessionid);

    const NPCS_TO_GENERATE = 4;

    // get recycled npcs for the user
    npcs = npcs.concat(
      await getRecycledNpcsForUser(request, NPCS_TO_GENERATE, id, sessionid)
    );
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
          object: npc.npc,
        });
        npcs.push({
          id: result.id,
          object: npc.npc,
        });
      } else {
        throw new Error('Failed to create npc');
      }
    }
    npcs.forEach((npc) => {
      // user's choices
      if (!request.body.addVoice) {
        delete npc.object.character.voice;
      }
      if (!request.body.includeBodyType) {
        delete npc.object.character.weight;
        delete npc.object.character.height;
      }
      addNpcToSentAlreadyList({
        npcid: npc.id,
        userid: id,
        sessionid,
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
  request: FastifyRequest<{ Body: GenerateBackstoryBody }>,
  reply: FastifyReply
) {
  try {
    const body = request.body;
    const npcid = body.id;

    const { id } = request.user || { id: undefined };

    await prisma.$transaction(async () => {
      const npcs = await getNpcForUpdate(prisma, npcid); // TODO: manually assign Prisma's table type
      if (!npcs.length) {
        throw new Error('NPC not found');
      }
      const npc = npcs[0];
      if (npc.hasbackstory === true || npc.backstorystatus !== null) {
        throw new Error(
          "It's currently possible to generate a backstory only once for an NPC"
        );
      }

      const roleplayStats = await parseRoleplayStats(npc.object as Character);
      let backstory = '';

      updateNpcBackstoryStatus(prisma, npcid, 'pending');
      reply.sse(
        (async function* source() {
          try {
            const adventurePrompt = await getDnDAdventurePrompt(
              npc.object as Character,
              roleplayStats,
              backstory
            );
            // start the stream for the adventure module
            const adventureStream = await generateTextStream(
              adventurePrompt,
              CURRENT_GOOD_MODEL
            );

            backstory += '\n\n';
            // return \n\n as a separator between the backstory and the adventure
            yield {
              id: '69',
              data: JSON.stringify('\n\n'),
            };

            for await (const chunk of adventureStream) {
              backstory += chunk.choices[0]?.delta?.content || '';
              yield {
                id: chunk.id,
                data: JSON.stringify(chunk.choices[0]?.delta?.content || ''),
              };
            }

            const physicalAppearancePrompt = await getPhysicalAppearancePrompt(
              npc.object as Character,
              roleplayStats
            );
            const physicalAppearanceStream = await generateTextStream(
              physicalAppearancePrompt,
              CURRENT_CHEAP_MODEL
            );

            yield {
              id: 'appearance_incoming',
              data: '',
            };

            let physicalAppearance = '';

            for await (const chunk of physicalAppearanceStream) {
              backstory += chunk.choices[0]?.delta?.content || '';
              physicalAppearance += chunk.choices[0]?.delta?.content || '';
              yield {
                id: chunk.id,
                data: JSON.stringify(chunk.choices[0]?.delta?.content || ''),
              };
            }

            //   generateCharacterHookAndSaveBackstory(
            //     prisma,
            //     npcid,
            //     backstory,
            //     physicalAppearance,
            // npc.object as Character,
            // roleplayStats,
            //   );
          } catch (error) {
            yield {
              id: 'error',
              data: JSON.stringify('An unexpected error occurred.'),
            };
          }
        })()
      );
    });
  } catch (error) {
    return handleError(error, reply);
  }
}

// async function generateCharacterHookAndSaveBackstory(prisma: PrismaClient, id: string, backstory: string, physicalAppearance: string, object: Character, roleplayStats: RoleplayStats) {

//   const characterHookPrompt = getCharacterHookPrompt(roleplayStats, backstory);
//   const characterHook = await generateText(characterHookPrompt, CURRENT_CHEAP_MODEL);

//   object.character.characterHooks = characterHook.choices[0].message.content || '';
//   calculateCharacterHook(object);

//   addBackstoryToNpc({
//     prisma,
//     id,
//     backstory,
//     physicalAppearance,
//     object,
//   });

// };

export async function postNpcRatingController(
  request: FastifyRequest<{ Body: PostNpcRatingBody }>,
  reply: FastifyReply
) {
  try {
    const { id, rating } = request.body;
    const userid = request?.user?.id;
    const sessionid = request.body?.sessionid;
    await postNpcRating({ npcid: id, userid, rating, sessionid });
    return reply.code(200).send({ id, rating });
  } catch (error) {
    return handleError(error, reply);
  }
}

export async function getNpcHandler(
  request: FastifyRequest<{ Params: { uuid: string } }>,
  reply: FastifyReply
) {
  try {
    const { uuid } = request.params;
    const npc = await getNpc(uuid);
    if (!npc) {
      throw new Error('NPC not found');
    }
    return reply.code(200).send(npc);
  } catch (error) {
    return handleError(error, reply);
  }
}

function reportWordsNotFound(
  wordsNotFound: string[],
  userid?: number,
  sessionid?: string
) {
  if (wordsNotFound.length) {
    postAnswer({
      answer: {
        data: wordsNotFound,
      },
      questionid: 'f1a73150-7c20-429e-93a0-12efbd6f3b03',
      userid,
      sessionid,
    });
  }
}
