import { z } from 'zod';
import { buildJsonSchemas } from 'fastify-zod';

const id = z.number();
const objectid = z.number();
const reason = z.string().min(2);
const report = z.string().min(2);

const reportObject = z.object({
  id,
  objectid,
  reason,
  report,
  datereported: z.string(),
  dateaction: z.string(),
  moderator: z.number(),
  action: z.string(),
});

const createReportSchema = z.object({
  objectid,
  reason,
  report,
});

const createReportResponseSchema = reportObject;

const getReportListResponseSchema = z.object({
  list: z.array(reportObject),
});

export type createReportInput = z.infer<typeof createReportSchema>;
export type createReportResponse = z.infer<typeof createReportResponseSchema>;
export type getReportListResponse = z.infer<typeof getReportListResponseSchema>;

export const { schemas: reportSchemas, $ref } = buildJsonSchemas(
  {
    createReportSchema,
    createReportResponseSchema,
    getReportListResponseSchema,
  },
  { $id: 'reportSchemas' }
);
