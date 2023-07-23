import { FastifyReply, FastifyRequest } from "fastify";
import { getSkillList, getRandomSkill } from "./skill.service";
import { handleError } from "@/utils/errors";

export async function getSkillListHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const skillList = await getSkillList();
    return reply.code(200).send({
      list: skillList,
    });
  } catch (error) {
    return handleError(error, reply);
  }
}

export async function getRandomSkillHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const skillObject = await getRandomSkill();
    return reply.code(200).send(skillObject);
  } catch (error) {
    return handleError(error, reply);
  }
}
