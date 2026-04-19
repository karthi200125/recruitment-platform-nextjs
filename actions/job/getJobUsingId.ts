'use server';

import { db } from '@/lib/db';
import { Prisma } from '@prisma/client';

// ✅ response type
interface ActionResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

// ✅ job type
type JobWithApplications = Prisma.JobGetPayload<{
    include: {
        jobApplications: true;
    };
}>;

export const getJobUsingId = async (
    jobId: number
): Promise<ActionResponse<JobWithApplications>> => {
    try {
        // 🔒 validation
        if (!jobId || typeof jobId !== 'number') {
            return { success: false, error: 'Invalid jobId' };
        }

        const job = await db.job.findUnique({
            where: { id: jobId },
            include: {
                jobApplications: true,
            },
        });

        if (!job) {
            return { success: false, error: 'Job not found' };
        }

        return {
            success: true,
            data: job,
        };
    } catch (error) {
        console.error('[GET_JOB_BY_ID_ERROR]', error);

        return {
            success: false,
            error: 'Failed to retrieve job',
        };
    }
};