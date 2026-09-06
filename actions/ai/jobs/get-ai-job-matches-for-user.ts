"use server";

import { db } from "@/lib/db";
import {
    getJobAIMatches,
    type AIJobMatchResult,
} from "./get-job-ai-matches";

interface JobForAIMatching {
    id: number;
    jobTitle: string;
    jobDesc: string;
    experience: string;
    city: string;
    state: string;
    country: string;
    type: string;
    mode: string;
    skills: string[];
}

export async function getAIJobMatchesForUser(
    userId: number,
    jobs: JobForAIMatching[]
): Promise<AIJobMatchResult[]> {
    if (!userId || !jobs.length) {
        return [];
    }

    const user = await db.user.findUnique({
        where: {
            id: userId,
        },

        select: {
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
                },

                take: 10,
            },

            experiences: {
                select: {
                    companyName: true,
                    position: true,
                    description: true,
                },

                take: 10,
            },

            projects: {
                select: {
                    proName: true,
                    proDesc: true,
                },

                take: 10,
            },
        },
    });

    if (!user) {
        return [];
    }

    return getJobAIMatches(
        {
            profession: user.profession,
            skills: user.skills ?? [],

            city: user.city,
            state: user.state,
            country: user.country,

            educations: user.educations,

            experiences: user.experiences,

            projects: user.projects,
        },
        jobs
    );
}