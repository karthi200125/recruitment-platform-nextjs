'use server';

import { db } from '@/lib/db';
import { Prisma } from '@prisma/client';

interface ActionResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

type SavedJob = Prisma.JobGetPayload<{
  include: {
    company: true;
  };
}>;

export const getSavedJobs = async (
  userId: number
): Promise<ActionResponse<SavedJob[]>> => {
  try {
    if (!userId || typeof userId !== 'number') {
      return { success: false, error: 'Invalid userId' };
    }

    // ✅ CORRECT RELATION QUERY
    const saved = await db.savedJob.findMany({
      where: { userId },
      include: {
        job: {
          include: {
            company: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const jobs = saved.map((item) => item.job);

    return {
      success: true,
      data: jobs,
    };
  } catch (error) {
    console.error('[GET_SAVED_JOBS_ERROR]', error);

    return {
      success: false,
      error: 'Failed to retrieve saved jobs',
    };
  }
};