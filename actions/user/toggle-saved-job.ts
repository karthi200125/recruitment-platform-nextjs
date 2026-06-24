"use server";

import { db } from "@/lib/db";

interface ToggleSavedJobProps {
    userId: number;
    jobId: number;
}

export async function toggleSavedJob({
    userId,
    jobId,
}: ToggleSavedJobProps) {
    if (!userId || !jobId) {
        throw new Error("Invalid IDs");
    }

    const existing = await db.savedJob.findUnique({
        where: {
            userId_jobId: {
                userId,
                jobId,
            },
        },
    });

    if (existing) {
        // ❌ Unsave
        await db.savedJob.delete({
            where: {
                userId_jobId: {
                    userId,
                    jobId,
                },
            },
        });

        return { saved: false };
    }

    // ✅ Save
    await db.savedJob.create({
        data: {
            userId,
            jobId,
        },
    });

    return { saved: true };
}