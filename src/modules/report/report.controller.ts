import { createReportInput } from './report.schema';
import { FastifyReply, FastifyRequest } from 'fastify';
import { createReport, getReportList } from './report.service';
import { handleError } from '@/utils/errors';

export async function getReportListHandler (
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = request.user;
  try {
    const reportList = await getReportList(id);
    console.log(reportList);
    return reply.code(200).send({
      list: reportList
    });
  } catch (error) {
    return handleError(error, reply);
  }
}

export async function createReportHandler (
  request: FastifyRequest<{Body: createReportInput }>,
  reply: FastifyReply
) {
  try {
    const { body } = request;
    const { id } = request.user;
    const report = await createReport(id, body);
    return reply.code(201).send(report);
  } catch (error) {
    return handleError(error, reply);
  }
}
