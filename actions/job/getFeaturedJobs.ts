'use server';

import { db } from '@/lib/db';
import { Prisma } from '@prisma/client';

type ActionResponse<T> = {
    success: boolean;
    data?: T;
    error?: string;
};

type FeaturedJobsPayload = Prisma.JobGetPayload<{
    include: {
        company: {
            select: {
                id: true;
                companyName: true;
                companyImage: true;
                companyCity: true;
                companyCountry: true;
            };
        };
    };
}>[];

export const getFeaturedJobs = async (): Promise<
    ActionResponse<FeaturedJobsPayload>
> => {
    try {
        const jobs = await db.job.findMany({
            include: {
                company: {
                    select: {
                        id: true,
                        companyName: true,
                        companyImage: true,
                        companyCity: true,
                        companyCountry: true,
                    },
                },
            },

            orderBy: {
                createdAt: 'desc',
            },

            take: 6,
        });

        return {
            success: true,
            data: jobs,
        };
    } catch (error) {
        console.error('[GET_FEATURED_JOBS_ERROR]', error);

        return {
            success: false,
            error: 'Failed to fetch featured jobs',
        };
    }
};