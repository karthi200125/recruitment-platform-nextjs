"use server";

import { unstable_cache } from "next/cache";

import { subDays } from "date-fns";

import { db } from "@/lib/db";
import { calculateGrowth } from "./calculateGrowth";


// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

interface Props {
    userId: number;

    appliedPage?: number;

    savedPage?: number;

    interviewsPage?: number;

    profileViewsPage?: number;

    limit?: number;
}

// ─────────────────────────────────────────────
// Action
// ─────────────────────────────────────────────

export const getCandidateDashboardData =
    unstable_cache(
        async ({
            userId,

            appliedPage = 1,

            savedPage = 1,

            interviewsPage = 1,

            profileViewsPage = 1,

            limit = 10,
        }: Props) => {
            // Dates
            const now = new Date();

            const current30Days =
                subDays(now, 30);

            const previous30Days =
                subDays(now, 60);

            // Pagination
            const appliedSkip =
                (appliedPage - 1) * limit;

            const savedSkip =
                (savedPage - 1) * limit;

            const interviewsSkip =
                (interviewsPage - 1) *
                limit;

            const profileViewsSkip =
                (profileViewsPage - 1) *
                limit;

            // ─────────────────────────────────────────
            // KPI COUNTS
            // ─────────────────────────────────────────

            const [
                currentAppliedCount,
                previousAppliedCount,

                currentSavedCount,
                previousSavedCount,

                currentInterviewsCount,
                previousInterviewsCount,

                // currentProfileViewsCount,
                // previousProfileViewsCount,
            ] = await Promise.all([
                // Applied Current
                db.jobApplication.count({
                    where: {
                        userId,

                        createdAt: {
                            gte: current30Days,
                        },
                    },
                }),

                // Applied Previous
                db.jobApplication.count({
                    where: {
                        userId,

                        createdAt: {
                            gte: previous30Days,

                            lt: current30Days,
                        },
                    },
                }),

                // Saved Current
                db.savedJob.count({
                    where: {
                        userId,

                        createdAt: {
                            gte: current30Days,
                        },
                    },
                }),

                // Saved Previous
                db.savedJob.count({
                    where: {
                        userId,

                        createdAt: {
                            gte: previous30Days,

                            lt: current30Days,
                        },
                    },
                }),

                // Interviews Current
                db.jobApplication.count({
                    where: {
                        userId,

                        OR: [
                            {
                                status:
                                    "INTERVIEW_SCHEDULED",
                            },

                            {
                                status:
                                    "INTERVIEWED",
                            },
                        ],

                        createdAt: {
                            gte: current30Days,
                        },
                    },
                }),

                // Interviews Previous
                db.jobApplication.count({
                    where: {
                        userId,

                        OR: [
                            {
                                status:
                                    "INTERVIEW_SCHEDULED",
                            },

                            {
                                status:
                                    "INTERVIEWED",
                            },
                        ],

                        createdAt: {
                            gte: previous30Days,

                            lt: current30Days,
                        },
                    },
                }),

                // Profile Views Current
                // db.profileView.count({
                //     where: {
                //         profileUserId:
                //             userId,

                //         createdAt: {
                //             gte: current30Days,
                //         },
                //     },
                // }),

                // Profile Views Previous
                // db.profileView.count({
                //     where: {
                //         profileUserId:
                //             userId,

                //         createdAt: {
                //             gte: previous30Days,

                //             lt: current30Days,
                //         },
                //     },
                // }),
            ]);

            // ─────────────────────────────────────────
            // Growth
            // ─────────────────────────────────────────

            const appliedGrowth =
                calculateGrowth(
                    currentAppliedCount,
                    previousAppliedCount
                );

            const savedGrowth =
                calculateGrowth(
                    currentSavedCount,
                    previousSavedCount
                );

            const interviewsGrowth =
                calculateGrowth(
                    currentInterviewsCount,
                    previousInterviewsCount
                );

            // const profileViewsGrowth =
            //     calculateGrowth(
            //         currentProfileViewsCount,
            //         previousProfileViewsCount
            //     );

            // ─────────────────────────────────────────
            // Tables Data
            // ─────────────────────────────────────────

            const [
                appliedJobs,
                appliedJobsTotal,

                savedJobs,
                savedJobsTotal,

                interviews,
                interviewsTotal,

                // profileViews,
                // profileViewsTotal,
            ] = await Promise.all([
                // Applied Jobs
                db.jobApplication.findMany({
                    where: {
                        userId,
                    },

                    include: {
                        job: {
                            include: {
                                company: true,
                            },
                        },
                    },

                    orderBy: {
                        createdAt: "desc",
                    },

                    skip: appliedSkip,

                    take: limit,
                }),

                db.jobApplication.count({
                    where: {
                        userId,
                    },
                }),

                // Saved Jobs
                db.savedJob.findMany({
                    where: {
                        userId,
                    },

                    include: {
                        job: {
                            include: {
                                company: true,
                            },
                        },
                    },

                    orderBy: {
                        createdAt: "desc",
                    },

                    skip: savedSkip,

                    take: limit,
                }),

                db.savedJob.count({
                    where: {
                        userId,
                    },
                }),

                // Interviews
                db.jobApplication.findMany({
                    where: {
                        userId,

                        OR: [
                            {
                                status:
                                    "INTERVIEW_SCHEDULED",
                            },

                            {
                                status:
                                    "INTERVIEWED",
                            },
                        ],
                    },

                    include: {
                        job: {
                            include: {
                                company: true,
                            },
                        },
                    },

                    orderBy: {
                        updatedAt: "desc",
                    },

                    skip: interviewsSkip,

                    take: limit,
                }),

                db.jobApplication.count({
                    where: {
                        userId,

                        OR: [
                            {
                                status:
                                    "INTERVIEW_SCHEDULED",
                            },

                            {
                                status:
                                    "INTERVIEWED",
                            },
                        ],
                    },
                }),

                // Profile Views
                // db.profileView.findMany({
                //     where: {
                //         profileUserId:
                //             userId,
                //     },

                //     include: {
                //         viewer: true,
                //     },

                //     orderBy: {
                //         createdAt: "desc",
                //     },

                //     skip: profileViewsSkip,

                //     take: limit,
                // }),

                // db.profileView.count({
                //     where: {
                //         profileUserId:
                //             userId,
                //     },
                // }),
            ]);

            // ─────────────────────────────────────────
            // Overview Data
            // ─────────────────────────────────────────

            const recentApplications =
                appliedJobs.slice(0, 5);

            const recentActivity =
                appliedJobs.slice(0, 5);

            const profileCompletion =
            {
                percentage: 80,

                items: [
                    {
                        label:
                            "Resume Uploaded",

                        completed:
                            true,
                    },

                    {
                        label:
                            "Skills Added",

                        completed:
                            true,
                    },

                    {
                        label:
                            "Profile Photo",

                        completed:
                            true,
                    },

                    {
                        label:
                            "Work Experience",

                        completed:
                            false,
                    },
                ],
            };

            // ─────────────────────────────────────────
            // Final Return
            // ─────────────────────────────────────────

            return {
                // KPI Stats
                stats: {
                    appliedJobs: {
                        count:
                            currentAppliedCount,

                        growth:
                            appliedGrowth.growth,

                        isPositive:
                            appliedGrowth.isPositive,

                        chartData: [],
                    },

                    savedJobs: {
                        count:
                            currentSavedCount,

                        growth:
                            savedGrowth.growth,

                        isPositive:
                            savedGrowth.isPositive,

                        chartData: [],
                    },

                    interviews: {
                        count:
                            currentInterviewsCount,

                        growth:
                            interviewsGrowth.growth,

                        isPositive:
                            interviewsGrowth.isPositive,

                        chartData: [],
                    },

                    // profileViews: {
                    //     count:
                    //         currentProfileViewsCount,

                    //     growth:
                    //         profileViewsGrowth.growth,

                    //     isPositive:
                    //         profileViewsGrowth.isPositive,

                    //     chartData: [],
                    // },
                },

                // Charts
                charts: {
                    applicationStatusChart:
                        [],

                    applicationActivityChart:
                        [],
                },

                // Overview Cards
                recentApplications,

                recentActivity,

                profileCompletion,

                // Applied Jobs Tab
                appliedJobs: {
                    data: appliedJobs,

                    total:
                        appliedJobsTotal,

                    page: appliedPage,

                    totalPages:
                        Math.ceil(
                            appliedJobsTotal /
                            limit
                        ),
                },

                // Saved Jobs Tab
                savedJobs: {
                    data: savedJobs,

                    total:
                        savedJobsTotal,

                    page: savedPage,

                    totalPages:
                        Math.ceil(
                            savedJobsTotal /
                            limit
                        ),
                },

                // Interviews Tab
                interviews: {
                    data: interviews,

                    total:
                        interviewsTotal,

                    page: interviewsPage,

                    totalPages:
                        Math.ceil(
                            interviewsTotal /
                            limit
                        ),
                },

                // Profile Views Tab
                // profileViews: {
                //     data: profileViews,

                //     total:
                //         profileViewsTotal,

                //     page:
                //         profileViewsPage,

                //     totalPages:
                //         Math.ceil(
                //             // profileViewsTotal /
                //             100 /
                //             limit
                //         ),
                // },
            };
        },

        ["candidate-dashboard-data"],

        {
            revalidate: 60,

            tags: [
                "candidate-dashboard",
            ],
        }
    );