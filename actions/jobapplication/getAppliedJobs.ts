'use server';

import { db } from '@/lib/db';
import { Prisma } from '@prisma/client';

interface ActionResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

type AppliedJob = Prisma.JobGetPayload<{
    include: {
        company: true;
    };
}>;

export const getAppliedJobs = async (
    userId: number
): Promise<ActionResponse<AppliedJob[]>> => {
    try {
        if (!userId || typeof userId !== 'number') {
            return { success: false, error: 'Invalid userId' };
        }

        // ✅ SINGLE QUERY (BEST PRACTICE)
        const jobs = await db.job.findMany({
            where: {
                jobApplications: {
                    some: {
                        userId,
                    },
                },
                userId: { not: userId }, // exclude own jobs
            },
            include: {
                company: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return {
            success: true,
            data: jobs,
        };
    } catch (error) {
        console.error('[GET_APPLIED_JOBS_ERROR]', error);

        return {
            success: false,
            error: 'Failed to retrieve applied jobs',
        };
    }
};