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
            return {
                success: false,
                error: 'Invalid userId',
            };
        }


        const user = await db.user.findUnique({
            where: { id: userId },
            select: { savedJobs: true },
        });

        if (!user) {
            return {
                success: false,
                error: 'User not found',
            };
        }


        if (!user.savedJobs || user.savedJobs.length === 0) {
            return {
                success: true,
                data: [],
            };
        }


        const jobs = await db.job.findMany({
            where: {
                id: {
                    in: user.savedJobs,
                },
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
        console.error('[GET_SAVED_JOBS_ERROR]', error);

        return {
            success: false,
            error: 'Failed to retrieve saved jobs',
        };
    }
};