import prisma from '@/utils/prisma';
import { GetRandomQuestionBody, PostAnswerBody } from './feedback.schema';

export async function getRandomQuestion(input: GetRandomQuestionBody) {
  const questionsCount = await prisma.feedbackquestions.count({
    where: {
      topic: input.topic,
      datecreated: {
        gte: input.dateFrom,
      },
    },
  });
  const array = await prisma.feedbackquestions.findMany({
    skip: Math.floor(Math.random() * questionsCount),
    take: 1,
    where: {
      topic: input.topic,
      datecreated: {
        gte: input.dateFrom,
      },
    },
  });
  if (array.length === 0) {
    return null;
  }
  return array[0];
}

export async function postAnswer(input: PostAnswerBody) {
  await prisma.feedbackanswers.create({
    data: {
      answer: input.answer,
      questionid: input.questionid,
      userid: input.userid || null,
      sessionid: input.sessionid || null,
    },
  });
}
