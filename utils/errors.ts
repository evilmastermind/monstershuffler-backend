import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { FastifyReply } from 'fastify';

export function handleError(error: unknown, reply: FastifyReply) {
  if (typeof error === 'string') {
    return reply.code(400).send(createErrorJSON(400, 'Bad request'));
  } else if (error instanceof PrismaClientKnownRequestError) {
    return reply
      .code(400)
      .send(createErrorJSON(400, handlePrismaErrors(error.code)));
  } else if (error instanceof Error) {
    console.warn(error);
    return reply.code(400).send(createErrorJSON(400, error.name));
  }
}

function handlePrismaErrors(code: string) {
  switch (code) {
    case 'P2002':
      return `${code}: this already exists in the database!`;
    case 'P2010':
      return `${code}: looks like a raw query failed.`;
  }
  return `Error code ${code}`;
}

function createErrorJSON(code: number, message: string) {
  return {
    code,
    message,
  };
}

export function requiredString(name: string) {
  return `${name} is a required field`;
}

export function isValidId(id: number) {
  return (
    id !== null && id !== undefined && typeof id !== 'undefined' && id >= 0
  );
}
