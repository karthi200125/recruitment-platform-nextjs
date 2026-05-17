"use server";

import { db } from "@/lib/db";

import {
    dashboardApplicationInclude,
    dashboardJobInclude,
} from "@/lib/dashboard-includes";

import { ApplicationStatus } from "@prisma/client";

export const getCandidateDashboardData = async (
    userId: number
) => {
    try {
        if (!userId) {
            return {
                success: false,
                error: "Unauthorized",
            };
        }

        const [
            applications,
            savedJobs,

            appliedCount,
            savedCount,
            interviewCount,

            // Placeholder for future profile analytics
            profileViewsCount,
        ] = await Promise.all([
            // Applications
            db.jobApplication.findMany({
                where: {
                    userId,
                },

                include:
                    dashboardApplicationInclude,

                orderBy: {
                    appliedAt: "desc",
                },

                take: 10,
            }),

            // Saved Jobs
            db.savedJob.findMany({
                where: {
                    userId,
                },

                include: {
                    job: {
                        include:
                            dashboardJobInclude,
                    },
                },

                orderBy: {
                    createdAt: "desc",
                },

                take: 10,
            }),

            // Applied Count
            db.jobApplication.count({
                where: {
                    userId,
                },
            }),

            // Saved Count
            db.savedJob.count({
                where: {
                    userId,
                },
            }),

            // Interviews Count
            db.jobApplication.count({
                where: {
                    userId,

                    status: {
                        in: [
                            ApplicationStatus.INTERVIEW_SCHEDULED,
                            ApplicationStatus.INTERVIEWED,
                        ],
                    },
                },
            }),

            // Placeholder
            Promise.resolve(0),
        ]);

        return {
            success: true,

            data: {
                applications,

                savedJobs,

                analytics: {
                    applicationTrend: [],
                    interviewTrend: [],
                },

                counts: {
                    applied: appliedCount,
                    saved: savedCount,
                    interviews: interviewCount,
                    profileViews:
                        profileViewsCount,
                },
            },
        };
    } catch (error) {
        console.error(
            "GET_CANDIDATE_DASHBOARD_DATA_ERROR",
            error
        );

        return {
            success: false,
            error:
                "Failed to fetch candidate dashboard data",
        };
    }
};