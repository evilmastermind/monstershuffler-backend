import { GetRandomQuestionBody, PostAnswerBody } from './feedback.schema';
import { FastifyReply, FastifyRequest } from 'fastify';
import { getRandomQuestion, postAnswer } from './feedback.service';
import { handleError, handleResultFound } from '@/utils/errors';

export async function getRandomQuestionHandler(
  request: FastifyRequest<{ Body: GetRandomQuestionBody }>,
  reply: FastifyReply
) {
  try {
    const question = await getRandomQuestion(request.body);
    return handleResultFound(question, reply);
  } catch (error) {
    return handleError(error, reply);
  }
}

export async function postAnswerHandler(
  request: FastifyRequest<{ Body: PostAnswerBody }>,
  reply: FastifyReply
) {
  try {
    await postAnswer(request.body);
    reply.code(204).send();
  } catch (error) {
    return handleError(error, reply);
  }
}
