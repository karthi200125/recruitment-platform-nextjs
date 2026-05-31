"use server";

import { unstable_cache } from "next/cache";

import {
    format,
    subDays,
} from "date-fns";

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
            // ─────────────────────────────────────────
            // Dates
            // ─────────────────────────────────────────

            const now = new Date();

            const current30Days =
                subDays(now, 30);

            const previous30Days =
                subDays(now, 60);

            // ─────────────────────────────────────────
            // Pagination
            // ─────────────────────────────────────────

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
            // KPI Counts
            // ─────────────────────────────────────────

            const [
                currentAppliedCount,
                previousAppliedCount,

                currentSavedCount,
                previousSavedCount,

                currentInterviewsCount,
                previousInterviewsCount,

                currentProfileViewsCount,
                previousProfileViewsCount,
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
                db.profileView.count({
                    where: {
                        profileUserId:
                            userId,

                        createdAt: {
                            gte: current30Days,
                        },
                    },
                }),

                // Profile Views Previous
                db.profileView.count({
                    where: {
                        profileUserId:
                            userId,

                        createdAt: {
                            gte: previous30Days,

                            lt: current30Days,
                        },
                    },
                }),
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

            const profileViewsGrowth =
                calculateGrowth(
                    currentProfileViewsCount,
                    previousProfileViewsCount
                );

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

                profileViews,
                profileViewsTotal,
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
                db.profileView.findMany({
                    where: {
                        profileUserId:
                            userId,
                    },

                    include: {
                        viewer: true,
                    },

                    orderBy: {
                        createdAt: "desc",
                    },

                    skip: profileViewsSkip,

                    take: limit,
                }),

                db.profileView.count({
                    where: {
                        profileUserId:
                            userId,
                    },
                }),
            ]);

            // ─────────────────────────────────────────
            // Status Chart
            // ─────────────────────────────────────────

            // ─────────────────────────────────────────
            // Application Status Chart
            // ─────────────────────────────────────────

            const [
                appliedCount,
                viewedCount,
                underReviewCount,
                shortlistedCount,
                interviewScheduledCount,
                interviewedCount,
                hiredCount,
                rejectedCount,
            ] = await Promise.all([
                db.jobApplication.count({
                    where: {
                        userId,
                        status: "APPLIED",
                    },
                }),

                db.jobApplication.count({
                    where: {
                        userId,
                        status: "VIEWED",
                    },
                }),

                db.jobApplication.count({
                    where: {
                        userId,
                        status: "UNDER_REVIEW",
                    },
                }),

                db.jobApplication.count({
                    where: {
                        userId,
                        status: "SHORTLISTED",
                    },
                }),

                db.jobApplication.count({
                    where: {
                        userId,
                        status:
                            "INTERVIEW_SCHEDULED",
                    },
                }),

                db.jobApplication.count({
                    where: {
                        userId,
                        status: "INTERVIEWED",
                    },
                }),

                db.jobApplication.count({
                    where: {
                        userId,
                        status: "HIRED",
                    },
                }),

                db.jobApplication.count({
                    where: {
                        userId,
                        status: "REJECTED",
                    },
                }),
            ]);

            const applicationStatusChart = [
                {
                    label: "Applied",
                    value: appliedCount,
                    color: "#F59E0B",
                },

                {
                    label: "Viewed",
                    value: viewedCount,
                    color: "#06B6D4",
                },

                {
                    label: "Under Review",
                    value: underReviewCount,
                    color: "#3B82F6",
                },

                {
                    label: "Shortlisted",
                    value: shortlistedCount,
                    color: "#8B5CF6",
                },

                {
                    label: "Interview Scheduled",
                    value:
                        interviewScheduledCount,
                    color: "#EC4899",
                },

                {
                    label: "Interviewed",
                    value: interviewedCount,
                    color: "#14B8A6",
                },

                {
                    label: "Hired",
                    value: hiredCount,
                    color: "#22C55E",
                },

                {
                    label: "Rejected",
                    value: rejectedCount,
                    color: "#EF4444",
                },
            ].filter((item) => item.value > 0);
            // ─────────────────────────────────────────
            // Activity Chart
            // ─────────────────────────────────────────

            const last30Applications =
                await db.jobApplication.findMany(
                    {
                        where: {
                            userId,

                            createdAt: {
                                gte: current30Days,
                            },
                        },

                        select: {
                            createdAt: true,
                        },

                        orderBy: {
                            createdAt:
                                "asc",
                        },
                    }
                );

            const activityMap =
                new Map();

            for (
                let i = 29;
                i >= 0;
                i--
            ) {
                const date =
                    subDays(now, i);

                const key = format(
                    date,
                    "MMM dd"
                );

                activityMap.set(
                    key,
                    0
                );
            }

            last30Applications.forEach(
                (application) => {
                    const key =
                        format(
                            application.createdAt,
                            "MMM dd"
                        );

                    activityMap.set(
                        key,
                        (activityMap.get(
                            key
                        ) || 0) + 1
                    );
                }
            );

            const applicationActivityChart =
                Array.from(
                    activityMap.entries()
                ).map(
                    ([date, value]) => ({
                        date,

                        value,
                    })
                );

            // ─────────────────────────────────────────
            // User
            // ─────────────────────────────────────────

            const user =
                await db.user.findUnique({
                    where: {
                        id: userId,
                    },
                });

            // ─────────────────────────────────────────
            // Profile Completion
            // ─────────────────────────────────────────

            const profileChecks =
                [
                    !!user?.username,

                    !!user?.email,

                    !!user?.userImage,

                    !!user?.resume,

                    !!user?.skills?.length,

                    !!user?.userBio,
                ];

            const completedItems =
                profileChecks.filter(
                    Boolean
                ).length;

            const profileCompletionPercentage =
                Math.round(
                    (completedItems /
                        profileChecks.length) *
                    100
                );

            const profileCompletion =
            {
                percentage:
                    profileCompletionPercentage,

                items: [
                    {
                        label:
                            "Profile Photo",

                        completed:
                            !!user?.userImage,
                    },

                    {
                        label:
                            "Resume Uploaded",

                        completed:
                            !!user?.resume,
                    },

                    {
                        label:
                            "Skills Added",

                        completed:
                            !!user
                                ?.skills
                                ?.length,
                    },

                    {
                        label:
                            "Bio Added",

                        completed:
                            !!user
                                ?.userBio,
                    },
                ],
            };

            // ─────────────────────────────────────────
            // Recent Data
            // ─────────────────────────────────────────

            const recentApplications =
                appliedJobs.slice(0, 5);

            const recentActivity =
                appliedJobs.slice(0, 5);

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

                        chartData:
                            applicationActivityChart.slice(
                                -7
                            ),
                    },

                    savedJobs: {
                        count:
                            currentSavedCount,

                        growth:
                            savedGrowth.growth,

                        isPositive:
                            savedGrowth.isPositive,

                        chartData:
                            applicationActivityChart.slice(
                                -7
                            ),
                    },

                    interviews: {
                        count:
                            currentInterviewsCount,

                        growth:
                            interviewsGrowth.growth,

                        isPositive:
                            interviewsGrowth.isPositive,

                        chartData:
                            applicationActivityChart.slice(
                                -7
                            ),
                    },

                    profileViews: {
                        count:
                            currentProfileViewsCount,

                        growth:
                            profileViewsGrowth.growth,

                        isPositive:
                            profileViewsGrowth.isPositive,

                        chartData:
                            applicationActivityChart.slice(
                                -7
                            ),
                    },
                },

                // Charts
                charts: {
                    applicationStatusChart,

                    applicationActivityChart,
                },

                // Overview
                recentApplications,

                recentActivity,

                profileCompletion,

                // Applied Jobs
                appliedJobs: {
                    data: appliedJobs,

                    total:
                        appliedJobsTotal,

                    page:
                        appliedPage,

                    totalPages:
                        Math.ceil(
                            appliedJobsTotal /
                            limit
                        ),
                },

                // Saved Jobs
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

                // Interviews
                interviews: {
                    data: interviews,

                    total:
                        interviewsTotal,

                    page:
                        interviewsPage,

                    totalPages:
                        Math.ceil(
                            interviewsTotal /
                            limit
                        ),
                },

                // Profile Views
                profileViews: {
                    data: profileViews,

                    total:
                        profileViewsTotal,

                    page:
                        profileViewsPage,

                    totalPages:
                        Math.ceil(
                            profileViewsTotal /
                            limit
                        ),
                },
            };
        },

        [
            "candidate-dashboard-data",
        ],

        {
            revalidate: 60,

            tags: [
                "candidate-dashboard",
            ],
        }
    );