'use server';

import { db } from '@/lib/db';

export const getAllJobs = async () => {
    try {
        return await db.job.findMany({
            include: {
                company: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    } catch (error) {
        console.error('Error fetching jobs:', error);
        throw new Error('Failed to fetch jobs');
    }
};