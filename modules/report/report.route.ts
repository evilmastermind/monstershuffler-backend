import { FastifyInstance } from 'fastify';
import { createReportHandler, getReportListHandler } from './report.controller';
import { $ref } from './report.schema';
import { jwtHeaderRequired } from '@/schemas';

async function reportRoutes(server: FastifyInstance) {
  server.post(
    '/',
    {
      preHandler: [server.authenticate],
      schema: {
        summary: 'Report a bug or malicious activities in the website.',
        description: 'Report a bug or malicious activities in the website.',
        body: $ref('createReportSchema'),
        tags: ['reports'],
        headers: jwtHeaderRequired,
        response: {
          201: $ref('createReportResponseSchema'),
        },
      },
    },
    createReportHandler
  );

  server.get(
    '/',
    {
      preHandler: [server.authenticate],
      schema: {
        summary: '[ADMIN ONLY] Get a list of all reports.',
        description: '[ADMIN ONLY] Get a list of all reports.',
        headers: jwtHeaderRequired,
        tags: ['reports'],
        response: {
          200: $ref('getReportListResponseSchema'),
        },
      },
    },
    getReportListHandler
  );
}

export default reportRoutes;
