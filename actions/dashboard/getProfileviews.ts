"use server";

import { Role } from "@prisma/client";

import { db } from "@/lib/db";

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
                include: {
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
                take: 5,
            });

        case "RECRUITER":
            return db.jobApplication.findMany({
                where: {
                    job: {
                        userId,
                    },
                },
                include: {
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
                take: 5,
            });

        case "ORGANIZATION":
            if (!companyId) return [];

            return db.jobApplication.findMany({
                where: {
                    job: {
                        companyId,
                    },
                },
                include: {
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
                take: 5,
            });

        default:
            return [];
    }
};