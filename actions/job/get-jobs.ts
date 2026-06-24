'use server';

import { db } from '@/lib/db';

export const getJobs = async () => {
  try {
    const jobs = await db.job.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      success: true,
      data: jobs,
    };
  } catch (error) {
    console.error('GET_JOBS_ERROR:', error);

    return {
      success: false,
      data: [],
    };
  }
};