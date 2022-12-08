import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { FastifyReply } from 'fastify';

export function handleError(error: unknown, reply: FastifyReply) {
  if (typeof error === 'string') {
    // console.log(error);
    return reply.code(400).send(createErrorJSON(400, 'Bad request'));
  } else if (error instanceof PrismaClientKnownRequestError) {
    return reply.code(400).send(createErrorJSON(400, handlePrismaErrors(error.code)));
  } else if (error instanceof Error) {
    console.log(error);
    return reply.code(400).send(createErrorJSON(400, error.name));
  } 
}


function handlePrismaErrors(code: string) {
  switch (code) {
  case 'P2002': return `${code}: this already exists in the database!`;
  }
  return `Error code ${code}`;
}

function createErrorJSON(code: number, message: string) {
  return {
    code,
    message
  };
}