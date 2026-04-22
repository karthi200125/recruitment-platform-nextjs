"use server";

import { db } from "@/lib/db";

interface IsSavedProps {
    userId: number;
    jobId: number;
}

export async function isSaved({ userId, jobId }: IsSavedProps) {
    if (!userId || !jobId) return false;

    const saved = await db.savedJob.findUnique({
        where: {
            userId_jobId: {
                userId,
                jobId,
            },
        },
    });

    return !!saved;
}