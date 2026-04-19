'use server';

import * as z from 'zod';
import { getServerSession } from 'next-auth';

import { db } from '@/lib/db';
import { authOptions } from '@/lib/authOptions';
import { CreateJobSchema } from '@/lib/SchemaTypes';

interface CreateJobProps {
    values: z.infer<typeof CreateJobSchema>;
    skills?: string[];
    questions?: string[];
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

        if (!session?.user) {
            return { error: 'Unauthorized' };
        }

        const currentUser = session.user;

        if (
            currentUser.role !== 'ORGANIZATION' &&
            currentUser.role !== 'RECRUITER'
        ) {
            return {
                error: 'Forbidden: You cannot create jobs',
            };
        }

        const validatedFields =
            CreateJobSchema.safeParse(values);

        if (!validatedFields.success) {
            return {
                error: 'Invalid fields',
                issues: validatedFields.error.format(),
            };
        }

        const { company, ...jobData } =
            validatedFields.data;

        const ownedCompany = await db.company.findFirst({
            where: {
                companyName: company,
                userId: currentUser.id,
            },
        });

        if (!ownedCompany) {
            return {
                error:
                    'Forbidden: You do not own this company',
            };
        }

        if (isEdit) {
            if (!jobId) {
                return { error: 'Job ID required for edit' };
            }

            const existingJob = await db.job.findUnique({
                where: { id: jobId },
            });

            if (!existingJob) {
                return { error: 'Job not found' };
            }

            if (existingJob.userId !== currentUser.id) {
                return {
                    error:
                        'Forbidden: You do not own this job',
                };
            }

            const updatedJob = await db.job.update({
                where: { id: jobId },
                data: {
                    ...jobData,
                    companyId: ownedCompany.id,
                    skills,
                    questions,
                    jobDesc,
                },
            });

            return {
                success: 'Job updated successfully',
                data: updatedJob,
            };
        }

        const newJob = await db.job.create({
            data: {
                ...jobData,
                userId: currentUser.id,
                companyId: ownedCompany.id,
                skills,
                questions,
                jobDesc,
            },
        });

        return {
            success: 'Job created successfully',
            data: newJob,
        };
    } catch (error) {
        console.error(
            'Create Job Action Error:',
            error
        );

        return {
            error:
                'Job creation failed. Please try again later.',
        };
    }
};