"use server";

import { db } from "@/lib/db";
import { analyzeJobMatch } from "./jobMatch";

export async function analyzeCurrentJobMatch(
    userId: number,
    jobId: number
) {
    const [user, job] = await Promise.all([
        db.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                role: true,
                profession: true,
                skills: true,
                city: true,
                state: true,
                country: true,

                educations: {
                    select: {
                        instituteName: true,
                        degree: true,
                        fieldOfStudy: true,
                        startDate: true,
                        endDate: true,
                        percentage: true,
                    },
                },

                experiences: {
                    select: {
                        companyName: true,
                        position: true,
                        startDate: true,
                        endDate: true,
                        description: true,
                    },
                },

                projects: {
                    select: {
                        proName: true,
                        proDesc: true,
                        proLink: true,
                    },
                },
            },
        }),

        db.job.findUnique({
            where: {
                id: jobId,
            },
            select: {
                jobTitle: true,
                jobDesc: true,
                experience: true,
                city: true,
                state: true,
                country: true,
                type: true,
                mode: true,
                skills: true,
            },
        }),
    ]);

    if (!user) {
        throw new Error("User not found");
    }

    if (!job) {
        throw new Error("Job not found");
    }

    return analyzeJobMatch({
        user,
        job,
    });
}