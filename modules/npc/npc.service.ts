import prisma from '@/utils/prisma';
import { Prisma } from '@prisma/client';
import type { PostNpc, PostNpcToSentAlreadyListInput, PostRandomNpcInput, PostRandomNpcResponse, AddBackstoryToNpcInput } from './npc.schema';
import { FastifyRequest } from 'fastify';
import { random } from '@/utils/functions';

/**
 * Gets npcs that the user hasn't seen yet.
 * Provides npcs with the highest
 * average rating.
 */
export async function getRecycledNpcsForUser(
  request: FastifyRequest<{ Body: PostRandomNpcInput }>,
  quantity = 1,
  userid?: number,
  sessionid?: string
) {
  if (userid === undefined && sessionid === undefined) {
    throw new Error('Invalid input');
  }

  const {
    alignmentEthicalChosen,
    alignmentMoralChosen,
    pronounsChosen,
    includeChildren
  } = request.body;

  // raceFilters is an array of query filters
  // the idea is to make as little queries as possible
  // when the user asks for multiple races (primary, secondary, and random)
  const raceFilters = getRaceFilters(request, quantity);

  let filtersArray = [];
  // additional query filters
  const classFilter = getClassFilter(request);
  const backgroundFilter = getBackgroundFilter(request);
  const alignmentEthicalFilter = alignmentEthicalChosen ? `n.alignmentethical = '${alignmentEthicalChosen}'` : '';
  const alignmentMoralFilter = alignmentMoralChosen ? `n.alignmentmoral = '${alignmentMoralChosen}'` : '';
  const pronounsFilter = pronounsChosen ? `n.gender = '${pronounsChosen}'` : '';
  const childrenFilter = includeChildren === true ? '' : 'n.ischild = false';

  // merging all filters
  filtersArray.push(classFilter, backgroundFilter, alignmentEthicalFilter, alignmentMoralFilter, pronounsFilter, childrenFilter);
  filtersArray = filtersArray.filter((filter) => filter !== '');
  let filters = filtersArray.join(' AND ');
  if (filters) {
    filters = `AND ${filters}`;
  }

  let npcs: PostRandomNpcResponse[] = []; 
  const userQuery = `userid ${userid !== undefined? `= ${userid}` : 'IS NULL'} AND sessionid ${sessionid !== undefined? `= '${sessionid}'` : 'IS NULL'}`;
  
  // loop through the raceFilters and get npcs
  for (let i = 0; i < raceFilters.length; i++) {
    const racefilter = raceFilters[i].filter ? `AND ${raceFilters[i].filter}` : '';
    npcs = npcs.concat(await prisma.$queryRaw`
      SELECT n.id, n.object, AVG(r.rating) as rating
      FROM
        npcs n
        LEFT JOIN npcsrating r on n.id = r.npcid
      WHERE
        n.id NOT IN (
          SELECT npcid
          FROM npcssenttousers
          WHERE ${Prisma.raw(userQuery)}
        ) AND
        n.hasbackstory = true
        ${Prisma.raw(filters)}
        ${Prisma.raw(racefilter)}
      GROUP BY n.id, n.object
      ORDER BY rating DESC
      LIMIT ${raceFilters[i].quantity}
    `);
  }
  return npcs;
}

function getRaceFilters(request: FastifyRequest<{ Body: PostRandomNpcInput }>, quantity = 1) {
  const {
    primaryRaceId,
    secondaryRaceId,
    primaryRacePercentage = 0,
    secondaryRacePercentage = 0,
    primaryRacevariantId,
    secondaryRacevariantId,
  } = request.body;

  const filters = [
    {
      filter: `n.raceid = ${primaryRaceId}`,
      quantity: 0,
    },
    {
      filter: `n.raceid = ${secondaryRaceId}`,
      quantity: 0,
    },
    {
      filter: '',
      quantity: 0
    }
  ];

  if (primaryRacevariantId) {
    filters[0].filter += ` AND n.racevariantid = ${primaryRacevariantId}`;
  }

  if (secondaryRacevariantId) {
    filters[0].filter += ` AND n.racevariantid = ${secondaryRacevariantId}`;
  }

  for (let i = 0; i < quantity; i++) {
    const random100 = random(1, 100);
    if (primaryRaceId && random100 <= primaryRacePercentage) {
      filters[0].quantity += 1;

    } else if (secondaryRaceId && random100 <= secondaryRacePercentage) {
      filters[1].quantity += 1;
    } else {
      filters[2].quantity += 1;
    }
  }

  return filters.filter((filter) => filter.quantity > 0);
}

function getClassFilter(request: FastifyRequest<{ Body: PostRandomNpcInput }>) {
  const {
    classType,
    classId,
    classvariantId,
  } = request.body;

  let filter = '';

  if (classType === 'none') {
    filter += 'n.classid IS NULL';
  }
  if (classType === 'randomAlways') {
    filter += 'n.classid IS NOT NULL';
  }
  if (classType === 'randomSometimes') {
    filter += `
      (
      CASE
          WHEN RANDOM() > 0.05 THEN n.classid IS NOT NULL
          ELSE n.classid IS NULL
      END
    `;
  }
  if (classType === 'specific' && classId) {
    filter += `n.classid = ${classId}`;
    if (classvariantId) {
      filter += ` AND n.classvariantid = ${classvariantId}`;
    }
  }
  return filter;
}

function getBackgroundFilter(request: FastifyRequest<{ Body: PostRandomNpcInput }>) {
  const {
    backgroundType,
    backgroundId,
  } = request.body;

  let filter = '';

  if (backgroundType === 'none') {
    filter += 'n.backgroundid IS NULL';
  } else if (backgroundType === 'random') {
    filter += 'n.backgroundid IS NOT NULL';
  } else if (backgroundType === 'specific' && backgroundId) {
    filter += `n.backgroundid = ${backgroundId}`;
  }
  return filter;
}

export async function getNpc(id: number) {
  return await prisma.npcs.findUnique({
    where: { id },
  });
}

export async function postNpc(input: PostNpc) {
  const { object, userid, sessionid } = input;
  const alignmentmoral = object.character?.alignmentMoral?.toLowerCase() || null;
  const alignmentethical = object.character?.alignmentEthical?.toLowerCase() || null;
  const gender = object.character.pronouns?.toLowerCase() || null;
  const age = object.character.age?.string || null;
  const raceid = object.character?.race?.id;
  if (!raceid || !alignmentmoral || !alignmentethical || !gender) {
    throw new Error('Invalid input');
  }
  return await prisma.npcs.create({
    data: {
      object,
      userid: userid || null,
      sessionid: sessionid || null,
      raceid,
      racevariantid: object.character?.racevariant?.id || null,
      classid: object.character?.class?.id || null,
      classvariantid: object.character?.classvariant?.id || null,
      backgroundid: object.character?.background?.id || null,
      alignmentmoral,
      alignmentethical,
      gender,
      ischild: age === 'child' || age === 'adolescent',
    },
  });
}

export async function addNpcToSentAlreadyList(input: PostNpcToSentAlreadyListInput) {
  const { npcid, userid, sessionid } = input;
  return await prisma.npcssenttousers.create({
    data: {
      npcid,
      userid: userid || null,
      sessionid: sessionid || null,
    },
  });
}

export async function addBackstoryToNpc(input: AddBackstoryToNpcInput) {
  const { id, backstory, object } = input;
  if (!object.character.user) {
    object.character.user = {};
  }
  object.character.user.backstory = { string: backstory };
  return await prisma.npcs.update({
    where: { id },
    data: { object, hasbackstory: true },
  });
}
