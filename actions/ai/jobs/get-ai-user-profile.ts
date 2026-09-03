"use server";

import { db } from "@/lib/db";

export async function getAIUserProfile(userId: number) {
    const user = await db.user.findUnique({
        where: {
            id: userId,
        },
        select: {
            id: true,
            username: true,
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
    });

    if (!user) {
        throw new Error("User not found");
    }

    return user;
}