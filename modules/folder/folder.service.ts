import prisma from '@/utils/prisma';
import { CreateFolderInput } from './folder.schema';

export async function createFolder(userid: number, input: CreateFolderInput) {
  const { name } = input;

  return await prisma.folders.create({
    data: {
      userid,
      folderid: null,
      name,
    },
  });
}

export async function getFolderContent(userid: number, folderid: number) {
  const folders = await prisma.folders.findMany({
    select: {
      id: true,
      name: true,
    },
    where: {
      folderid,
      userid,
    },
    orderBy: [
      {
        name: 'asc',
      },
    ],
  });

  const characters = await prisma.characters.findMany({
    select: {
      id: true,
      object: true,
      publishedcharacters: {
        select: {
          adds: true,
          url: true,
        },
      },
      publishedcharacters_ratings: {
        select: {
          value: true,
        },
      },
    },
    where: {
      folderid,
      userid,
    },
    orderBy: [
      {
        id: 'asc',
      },
    ],
  });

  const classes = await prisma.classes.findMany({
    select: {
      id: true,
      object: true,
      publishedclasses: {
        select: {
          adds: true,
          url: true,
        },
      },
      publishedclasses_ratings: {
        select: {
          value: true,
        },
      },
    },
    where: {
      folderid,
      userid,
    },
    orderBy: [
      {
        id: 'asc',
      },
    ],
  });

  const races = await prisma.races.findMany({
    select: {
      id: true,
      object: true,
      publishedraces: {
        select: {
          adds: true,
          url: true,
        },
      },
      publishedraces_ratings: {
        select: {
          value: true,
        },
      },
    },
    where: {
      folderid,
      userid,
    },
    orderBy: [
      {
        id: 'asc',
      },
    ],
  });

  const templates = await prisma.templates.findMany({
    select: {
      id: true,
      object: true,
      publishedtemplates: {
        select: {
          adds: true,
          url: true,
        },
      },
      publishedtemplates_ratings: {
        select: {
          value: true,
        },
      },
    },
    where: {
      folderid,
      userid,
    },
    orderBy: [
      {
        id: 'asc',
      },
    ],
  });

  return {
    folders,
    characters,
    classes,
    races,
    templates,
  };
}

export async function updateFolder(
  userid: number,
  folderid: number,
  input: CreateFolderInput
) {
  const { name } = input;

  return await prisma.folders.updateMany({
    where: {
      id: folderid,
      userid,
    },
    data: {
      name,
    },
  });
}

export async function deleteFolder(userid: number, folderid: number) {
  return await prisma.folders.deleteMany({
    where: {
      id: folderid,
      userid,
    },
  });
}
