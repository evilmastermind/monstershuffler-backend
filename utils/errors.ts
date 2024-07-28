import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { FastifyReply } from 'fastify';

export function handleResultFound(object: any, reply: FastifyReply) {
  if (!object) {
    return reply.code(404).send({
      message: 'Action not found',
    });
  }
  return reply.code(200).send(object);
}

export function handleError(error: unknown, reply: FastifyReply) {
  if (typeof error === 'string') {
    return reply.code(400).send(createErrorJSON(400, 'Bad request'));
  } else if (error instanceof PrismaClientKnownRequestError) {
    console.error(error.code);
    console.error(error.stack);
    return reply
      .code(400)
      .send(createErrorJSON(400, handlePrismaErrors(error.code)));
  } else if (error instanceof Error) {
    console.error(error);
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
