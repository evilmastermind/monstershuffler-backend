import prisma from '@/utils/prisma';
import { Settings } from './pagesetting.schema';

export async function getPagesetting(userid: number, page: string) {
  const array = await prisma.pagesettings.findMany({
    where: {
      userid,
      page
    }
  });
  if (array.length === 0) {
    return null;
  }
  const result = array[0];
  const response = {
    page: result.page,
    object: result.object,
  };
  return response;
}

export async function setPagesetting(userid: number, page: string, object: Settings) {
  return await prisma.pagesettings.upsert({
    where: {
      userid_page: {
        userid,
        page
      }
    },
    update: {
      object
    },
    create: {
      userid,
      page,
      object
    }
  });
}
