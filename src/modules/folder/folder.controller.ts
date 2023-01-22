import { CreateFolderInput } from './folder.schema';
import { FastifyReply, FastifyRequest } from 'fastify';
import { createFolder, getFolderContent, updateFolder, deleteFolder } from './folder.service';
import { handleError } from '@/utils/errors';
import { Race } from '@/modules/race/race.schema';
import { Class } from '@/modules/class/class.schema';
import { Template } from '@/modules/template/template.schema';
import { Character } from '@/modules/character/character.schema';


function extractNegativeRatings(ratings: {value: number}[]) {
  return ratings.reduce((accumulator, currentValue) => {
    if (currentValue.value < 0) {
      return accumulator + currentValue.value;
    }
    return accumulator;
  }, 0);
}
function extractPositiveRatings(ratings: {value: number}[]) {
  return ratings.reduce((accumulator, currentValue) => {
    if (currentValue.value > 0) {
      return accumulator + currentValue.value;
    }
    return accumulator;
  }, 0);
}

export async function getFolderContentHandler (
  request: FastifyRequest<{
    Params: {
      folderId: string;
    } 
  }>,
  reply: FastifyReply
) {
  const { id } = request.user  || { id: 0 };
  const folderId = request.params.folderId;
  try {
    const folderContent = await getFolderContent(id, parseInt(folderId));
    const characters = folderContent.characters.map((character) => {
      return {
        id: character.id,
        // TODO: here I need to retrieve the informations inside .statistics
        adds: character?.publishedcharacters?.adds || null,
        url: character?.publishedcharacters?.url || null,
        negativeratings: extractNegativeRatings(character.publishedcharacters_ratings),
        positiveratings: extractPositiveRatings(character.publishedcharacters_ratings),
      };
    });
    const races = folderContent.races.map((race) => {
      return {
        id: race.id,
        name: (race.object as Race).name,
        adds: race?.publishedraces?.adds || null,
        url: race?.publishedraces?.url || null,
        negativeratings: extractNegativeRatings(race.publishedraces_ratings),
        positiveratings: extractPositiveRatings(race.publishedraces_ratings),
      };
    });
    const classes = folderContent.classes.map((classObject) => {
      return {
        id: classObject.id,
        name: (classObject.object as Class).name,
        adds: classObject?.publishedclasses?.adds || null,
        url: classObject?.publishedclasses?.url || null,
        negativeratings: extractNegativeRatings(classObject.publishedclasses_ratings),
        positiveratings: extractPositiveRatings(classObject.publishedclasses_ratings),
      };
    });
    const templates = folderContent.templates.map((template) => {
      return {
        id: template.id,
        name: (template.object as Template).name,
        adds: template?.publishedtemplates?.adds || null,
        url: template?.publishedtemplates?.url || null,
        negativeratings: extractNegativeRatings(template.publishedtemplates_ratings),
        positiveratings: extractPositiveRatings(template.publishedtemplates_ratings),
      };
    });

    return reply.code(200).send({
      folders: folderContent.folders,
      characters,
      races,
      classes,
      templates,
    });
  } catch (error) {
    return handleError(error, reply);
  }
}

export async function createFolderHandler (
  request: FastifyRequest<{Body: CreateFolderInput }>,
  reply: FastifyReply
) {
  try {
    const { body } = request;
    const { id } = request.user;
    const folderObject = await createFolder(id, body);
    return reply.code(201).send(folderObject);
  } catch (error) {
    return handleError(error, reply);
  }
}

export async function updateFolderHandler (
  request: FastifyRequest<{
    Params: {
      folderId: string;
    },
    Body: CreateFolderInput
  }>,
  reply: FastifyReply
) {
  try {
    const { id } = request.user;
    const { folderId } = request.params;
    const { body } = request;
    const folderObject = await updateFolder(id, parseInt(folderId), body);
    return reply.code(200).send(folderObject);
  } catch (error) {
    return handleError(error, reply);
  }
}

export async function deleteFolderHandler (
  request: FastifyRequest<{
    Params: {
      folderId: string;
    }
  }>,
  reply: FastifyReply
) {
  try {
    const { id } = request.user;
    const { folderId } = request.params;
    const folderObject = await deleteFolder(id, parseInt(folderId));
    return reply.code(200).send(folderObject);
  } catch (error) {
    return handleError(error, reply);
  }
}
