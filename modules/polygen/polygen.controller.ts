import { Grammar } from './polygen.schema';
import { FastifyReply, FastifyRequest } from 'fastify';
import { handleError } from '@/utils/errors';
import plugin = require('@/plugins/polygen.js');
import crypto from 'crypto';

export async function parsePolygenHandler(
  request: FastifyRequest<{
    Body: Grammar;
  }>,
  reply: FastifyReply
) {
  // const { id } = request.user || { id: 0 };
  const { grammar } = request.body;
  try {
    // @ts-expect-error there is no type for Polygen
    const result = await plugin.Polygen.generate(grammar)();
    if (result.startsWith('error:')) {
      return reply.code(400).send(result);
    }
    return reply.code(200).send({
      result
    });
  } catch (error) {
    return handleError(error, reply);
  }
}
