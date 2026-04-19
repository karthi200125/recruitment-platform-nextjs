'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { db } from '@/lib/db';

export const deleteJob = async (jobId: number) => {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return { error: 'Unauthorized' };
        }

        const existingJob = await db.job.findUnique({
            where: { id: jobId },
        });

        if (!existingJob) {
            return { error: 'Job not found' };
        }

        if (existingJob.userId !== session.user.id) {
            return { error: 'Forbidden' };
        }

        await db.job.delete({
            where: { id: jobId },
        });

        return { success: 'Job deleted successfully' };
    } catch (error) {
        console.error('Delete job error:', error);

        return { error: 'Job delete failed' };
    }
};