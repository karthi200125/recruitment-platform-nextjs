'use server';

import { getServerSession } from 'next-auth';
import * as z from 'zod';

import { authOptions } from '@/lib/auth/authOptions';
import { FEATURES } from '@/lib/dashboard/proFeatures';
import { db } from '@/lib/db';
import { meiliClient } from "@/lib/meilisearch";
import { CreateJobSchema } from '@/lib/SchemaTypes';
import { JobQuestionType } from '@/types';
import { Prisma } from '@prisma/client';
import { getCurrentUserCompany } from '../company/get-current-user-company';


interface CreateJobProps {
    values: z.infer<typeof CreateJobSchema>;
    skills?: string[];
    questions?: JobQuestionType[];
    jobDesc?: string;
    isEdit?: boolean;
    jobId?: number;
}

export const createJobAction = async ({
    values,
    skills = [],
    questions = [],
    jobDesc = '',
    isEdit = false,
    jobId,
}: CreateJobProps) => {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return { error: 'Unauthorized' };
        }

        const currentUser = await db.user.findUnique({
            where: { id: session.user.id },
            include: { company: true },
        });

        if (!currentUser) {
            return { error: 'User not found' };
        }

        // 🚫 ROLE CHECK
        if (
            currentUser.role !== 'RECRUITER' &&
            currentUser.role !== 'ORGANIZATION'
        ) {
            return { error: 'You cannot create jobs' };
        }

        // ✅ VALIDATE INPUT
        const validated = CreateJobSchema.safeParse(values);
        if (!validated.success) {
            return { error: 'Invalid form data' };
        }

        const { company: _, ...jobData } = validated.data;

        const currentCompany = await getCurrentUserCompany(currentUser.id);

        if (!currentCompany) {
            return {
                error:
                    "You must belong to a company before posting jobs.",
            };
        }

        if (!currentCompany.companyIsVerified) {
            return {
                error:
                    "Your company must be verified before posting jobs.",
            };
        }

        // ✅ FEATURE LIMITS
        const tier = currentUser.isPro ? 'PRO' : 'FREE';
        const features = FEATURES[currentUser.role][tier];

        // ACTIVE JOBS
        const activeJobs = await db.job.count({
            where: {
                userId: currentUser.id,
                status: 'ACTIVE',
            },
        });

        // MONTHLY JOBS
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const monthlyJobs = await db.job.count({
            where: {
                userId: currentUser.id,
                createdAt: { gte: startOfMonth },
            },
        });

        if (activeJobs >= features.MAX_ACTIVE_JOBS) {
            return { error: 'Active job limit reached. Upgrade plan.' };
        }

        if (
            'JOBS_PER_MONTH' in features &&
            monthlyJobs >= features.JOBS_PER_MONTH
        ) {
            return { error: 'Monthly job limit reached. Upgrade plan.' };
        }

        // ✏️ EDIT JOB
        if (isEdit) {
            if (!jobId) return { error: 'Job ID required' };

            const existingJob = await db.job.findUnique({
                where: { id: jobId },
            });

            if (!existingJob) return { error: 'Job not found' };

            if (existingJob.userId !== currentUser.id) {
                return { error: 'Not authorized' };
            }

            const updatedJob = await db.job.update({
                where: { id: jobId },
                data: {
                    ...jobData,
                    companyId: currentCompany.id,
                    skills,
                    questions: questions as unknown as Prisma.InputJsonValue,
                    jobDesc,
                },
            });

            await meiliClient
                .index("jobs")
                .updateDocuments([updatedJob]);

            return { success: 'Job updated', data: updatedJob };
        }

        // 🆕 CREATE JOB
        const newJob = await db.job.create({
            data: {
                ...jobData,
                userId: currentUser.id,
                companyId: currentCompany.id,
                skills,
                questions: questions as unknown as Prisma.InputJsonValue,
                jobDesc,
                status: 'ACTIVE',
            },
        });

        await meiliClient
            .index("jobs")
            .addDocuments([newJob]);

        return { success: 'Job created successfully', data: newJob };
    } catch (error) {
        console.error('Create Job Error:', error);
        return { error: 'Something went wrong' };
    }
};