import { z } from 'zod';

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

export const sPostReportBody = z.object({
  objectid,
  reason,
  report,
});

export const sPostReportResponse = reportObject;

export const sGetReportListResponse = z.object({
  list: z.array(reportObject),
});

export type PostReportBody = z.infer<typeof sPostReportBody>;
export type PostReportResponse = z.infer<typeof sPostReportResponse>;
export type GetReportListResponse = z.infer<typeof sGetReportListResponse>;
