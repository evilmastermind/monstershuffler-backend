import { FastifyInstance } from 'fastify';
import { createReportHandler } from './report.controller';
import { $ref } from './report.schema';
import { jwtHeaderRequired } from '@/modules/schemas';

async function reportRoutes(server: FastifyInstance) {
  server.post(
    '/',
    {
      preHandler: [server.authenticate],
      schema: {
        summary: 'Report a bug or malicious activities in the website.',
        description: 'Report a bug or malicious activities in the website.',
        body: $ref('createReportSchema'),
        tags: ['report'],
        headers: jwtHeaderRequired,
        response: {
          201: $ref('getReportResponseSchema'),
        },
      },
    },
    createReportHandler
  );
}
