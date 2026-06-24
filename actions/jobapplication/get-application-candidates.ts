'use server';

import { db } from '@/lib/db';
import { Prisma } from '@prisma/client';

interface ActionResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

type CandidateApplication = Prisma.JobApplicationGetPayload<{
    include: {
        user: true;
        job: true;
    };
}>;

type CandidateType = 'TopApplicants' | 'EarlyApplicants';

export const getApplicationCandidates = async (
    jobId: number,
    type: CandidateType = 'EarlyApplicants'
): Promise<ActionResponse<CandidateApplication[]>> => {
    try {
        // 🔒 validation
        if (!jobId || typeof jobId !== 'number') {
            return { success: false, error: 'Invalid jobId' };
        }

        // ================= FETCH APPLICATIONS =================
        const applications = await db.jobApplication.findMany({
            where: {
                jobId,
                isNotIntrested: false,
            },
            include: {
                user: true,
                job: true,
            },
        });

        if (applications.length === 0) {
            return { success: true, data: [] };
        }

        // ================= EARLY APPLICANTS =================
        if (type === 'EarlyApplicants') {
            const sorted = applications.sort(
                (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
            );

            return { success: true, data: sorted };
        }

        // ================= TOP APPLICANTS =================

        const job = await db.job.findUnique({
            where: { id: jobId },
            select: {
                skills: true,
                state: true,
            },
        });

        if (!job) {
            return { success: false, error: 'Job not found' };
        }

        const ranked = [...applications].sort((a, b) => {
            const userA = a.user;
            const userB = b.user;

            // 1️⃣ Skills match (MOST IMPORTANT)
            const skillsA =
                userA.skills?.filter((s) => job.skills.includes(s)).length || 0;
            const skillsB =
                userB.skills?.filter((s) => job.skills.includes(s)).length || 0;
            if (skillsA !== skillsB) return skillsB - skillsA;

            // 2️⃣ Location match
            const locA = userA.state === job.state ? 1 : 0;
            const locB = userB.state === job.state ? 1 : 0;
            if (locA !== locB) return locB - locA;

            // 3️⃣ Profile views (popularity)
            const viewsA = userA.ProfileViews?.length || 0;
            const viewsB = userB.ProfileViews?.length || 0;
            if (viewsA !== viewsB) return viewsB - viewsA;

            // 4️⃣ Pro users priority
            if (userA.isPro !== userB.isPro) {
                return userB.isPro ? 1 : -1;
            }

            return 0;
        });

        return {
            success: true,
            data: ranked,
        };
    } catch (error) {
        console.error('[GET_APPLICATION_CANDIDATES_ERROR]', error);

        return {
            success: false,
            error: 'Failed to retrieve candidates',
        };
    }
};