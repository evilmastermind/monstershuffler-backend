import { Settings } from './pagesetting.schema';
import { setPagesetting, getPagesetting } from './pagesetting.service';
import { FastifyReply, FastifyRequest } from 'fastify';
import { handleError, handleResultFound } from '@/utils/errors';

export async function getPagesettingHandler(
  request: FastifyRequest<{
    Params: {
      page: string;
    };
  }>,
  reply: FastifyReply
) {
  const { id } = request.user || { id: 0 };
  const page = request.params.page;
  try {
    const pagesetting = await getPagesetting(id, page);
    return handleResultFound(pagesetting, reply);
  } catch (error) {
    return handleError(error, reply);
  }
}

export async function setPagesettingHandler(
  request: FastifyRequest<{
    Params: {
      page: string;
    };
    Body: Settings;
  }>,
  reply: FastifyReply
) {
  const { id } = request.user || { id: 0 };
  const page = request.params.page;
  const settings = request.body;
  try {
    await setPagesetting(id, page, settings);
    return reply.code(200).send('OK');
  } catch (error) {
    return handleError(error, reply);
  }
}
