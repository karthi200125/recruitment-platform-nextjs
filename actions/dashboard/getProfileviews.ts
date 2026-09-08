"use server";

import { Role } from "@prisma/client";

import { db } from "@/lib/db";

const RECENT_PROFILE_VIEW_LIMIT = 5;
const RECENT_APPLICATION_LIMIT = 5;

export const getProfileViews = async (
    userId: number,
    role: Role,
    companyId?: number | null
) => {
    switch (role) {
        case "CANDIDATE":
            return db.profileView.findMany({
                where: {
                    profileUserId: userId,
                },
                select: {
                    id: true,
                    createdAt: true,
                    viewer: {
                        select: {
                            id: true,
                            username: true,
                            profileImage: true,
                            profession: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: "desc",
                },
                take: RECENT_PROFILE_VIEW_LIMIT,
            });

        case "RECRUITER":
            return db.jobApplication.findMany({
                where: {
                    job: {
                        userId,
                    },
                },
                select: {
                    id: true,
                    createdAt: true,
                    user: {
                        select: {
                            id: true,
                            username: true,
                            profileImage: true,
                            profession: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: "desc",
                },
                take: RECENT_APPLICATION_LIMIT,
            });

        case "ORGANIZATION":
            if (!companyId) {
                return [];
            }

            return db.jobApplication.findMany({
                where: {
                    job: {
                        companyId,
                    },
                },
                select: {
                    id: true,
                    createdAt: true,
                    user: {
                        select: {
                            id: true,
                            username: true,
                            profileImage: true,
                            profession: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: "desc",
                },
                take: RECENT_APPLICATION_LIMIT,
            });

        default:
            return [];
    }
};