'use server';

import { db } from '@/lib/db';
import { Prisma } from '@prisma/client';

interface ActionResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

type ActionTakenJob = Prisma.JobGetPayload<{
    include: {
        company: true;
    };
}>;

export const getActionTakenJobs = async (
    userId: number
): Promise<ActionResponse<ActionTakenJob[]>> => {
    try {

        if (!userId || typeof userId !== 'number') {
            return {
                success: false,
                error: 'Invalid userId',
            };
        }


        const jobs = await db.job.findMany({
            where: {
                jobApplications: {
                    some: {
                        userId,
                        isSelected: true,
                    },
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
        console.error('[GET_ACTION_TAKEN_JOBS_ERROR]', error);

        return {
            success: false,
            error: 'Failed to retrieve action taken jobs',
        };
    }
};