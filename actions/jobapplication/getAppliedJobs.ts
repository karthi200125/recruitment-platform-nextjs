'use server';

import { db } from '@/lib/db';

// ✅ Define return type
interface GetAppliedJobsResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

// ✅ Optional: infer job type from Prisma (BEST PRACTICE)
import { Prisma } from '@prisma/client';

type AppliedJob = Prisma.JobGetPayload<{
    include: {
        company: true;
    };
}>;

// ✅ Main function
export const getAppliedJobs = async (
    userId: number
): Promise<GetAppliedJobsResponse<AppliedJob[]>> => {
    try {
        // 🔒 Validate input
        if (!userId || typeof userId !== 'number') {
            return {
                success: false,
                error: 'Invalid userId',
            };
        }

        // 1️⃣ Get applied job IDs
        const jobApplications = await db.jobApplication.findMany({
            where: { userId },
            select: { jobId: true },
        });

        // 🚀 Early return (performance)
        if (jobApplications.length === 0) {
            return {
                success: true,
                data: [],
            };
        }

        const jobIds = jobApplications.map((app) => app.jobId);

        // 2️⃣ Fetch jobs
        const appliedJobs = await db.job.findMany({
            where: {
                id: { in: jobIds },
                userId: { not: userId }, // exclude own jobs
            },
            include: {
                company: true,
            },
            orderBy: {
                createdAt: 'desc', // ✅ production UX improvement
            },
        });

        return {
            success: true,
            data: appliedJobs,
        };
    } catch (error) {
        console.error('[GET_APPLIED_JOBS_ERROR]', error);

        return {
            success: false,
            error: 'Failed to retrieve applied jobs',
        };
    }
};