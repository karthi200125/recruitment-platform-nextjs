'use server';

import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/authOptions';
import { db } from '@/lib/db';

export async function applyForJob(
  jobId: number,
  candidateEmail: string,
  candidateMobile: string,
  candidateResume: string,
  questionAndAnswers: any
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return { error: 'Unauthorized' };
    }

    const currentUser = session.user;

    if (currentUser.role === 'ORGANIZATION') {
      return {
        error: 'Organizations cannot apply for jobs',
      };
    }

    const job = await db.job.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      return { error: 'Job not found' };
    }

    const existingApplication =
      await db.jobApplication.findFirst({
        where: {
          userId: currentUser.id,
          jobId,
        },
      });

    if (existingApplication) {
      return {
        error:
          'You have already applied for this job',
      };
    }

    await db.jobApplication.create({
      data: {
        userId: currentUser.id,
        jobId,
        candidateEmail,
        candidateMobile,
        candidateResume,
        questionAndAnswers,
      },
    });

    return {
      success: 'Job applied successfully',
    };
  } catch (error) {
    console.error(
      'Apply job error:',
      error
    );

    return {
      error: 'Error applying for job',
    };
  }
}