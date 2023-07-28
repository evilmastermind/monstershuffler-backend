import prisma from '@/utils/prisma';
import { createReportInput } from './report.schema';
import { isAdmin } from '@/modules/user/user.service';

export async function createReport(userid: number, input: createReportInput) {
  const { objectid, reason, report } = input;

  return await prisma.reports.create({
    data: {
      userid,
      objectid,
      reason,
      report,
    },
  });
}

export async function getReportList(userid: number) {
  if (!(await isAdmin(userid))) {
    return [];
  }

  return await prisma.reports.findMany({
    orderBy: [
      {
        userid: 'asc',
      },
      {
        id: 'asc',
      },
    ],
  });
}
