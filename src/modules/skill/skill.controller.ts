import { FastifyReply, FastifyRequest } from 'fastify';
import { getSkillList } from './skill.service';
import { handleError } from '@/utils/errors';

export async function getSkillListHandler (
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const skillList = await getSkillList();
    return reply.code(200).send({
      list: skillList
    });
  } catch (error) {
    return handleError(error, reply);
  }
}
