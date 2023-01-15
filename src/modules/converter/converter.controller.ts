import { FastifyReply, FastifyRequest } from 'fastify';
import { getAllClasses } from './converter.service';
import { handleError } from '@/utils/errors';

export async function converterHandler (
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const classes = await getAllClasses();
    
    return reply.code(200).send();
  } catch (error) {
    return handleError(error, reply);
  }
}
