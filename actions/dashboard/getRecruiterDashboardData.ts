// actions/dashboard/recruiter/getRecruiterDashboardData.ts

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

    postedJobsPage?: number;

    applicantsPage?: number;

    interviewsPage?: number;

    hiredPage?: number;

    limit?: number;
}

// ─────────────────────────────────────────────
// Action
// ─────────────────────────────────────────────

export const getRecruiterDashboardData =
    unstable_cache(
        async ({
            userId,

            postedJobsPage = 1,

            applicantsPage = 1,

            interviewsPage = 1,

            hiredPage = 1,

            limit = 10,
        }: Props) => {
            // Dates
            const now = new Date();

            const current30Days =
                subDays(now, 30);

            const previous30Days =
                subDays(now, 60);

            // Pagination
            const postedJobsSkip =
                (postedJobsPage - 1) *
                limit;

            const applicantsSkip =
                (applicantsPage - 1) *
                limit;

            const interviewsSkip =
                (interviewsPage - 1) *
                limit;

            const hiredSkip =
                (hiredPage - 1) *
                limit;

            // KPI Counts
            const [
                currentPostedJobsCount,
                previousPostedJobsCount,

                currentApplicantsCount,
                previousApplicantsCount,

                currentInterviewsCount,
                previousInterviewsCount,

                currentHiredCount,
                previousHiredCount,
            ] = await Promise.all([
                // Posted Jobs Current
                db.job.count({
                    where: {
                        userId,

                        createdAt: {
                            gte: current30Days,
                        },
                    },
                }),

                // Posted Jobs Previous
                db.job.count({
                    where: {
                        userId,

                        createdAt: {
                            gte: previous30Days,

                            lt: current30Days,
                        },
                    },
                }),

                // Applicants Current
                db.jobApplication.count({
                    where: {
                        job: {
                            userId,
                        },

                        createdAt: {
                            gte: current30Days,
                        },
                    },
                }),

                // Applicants Previous
                db.jobApplication.count({
                    where: {
                        job: {
                            userId,
                        },

                        createdAt: {
                            gte: previous30Days,

                            lt: current30Days,
                        },
                    },
                }),

                // Interviews Current
                db.jobApplication.count({
                    where: {
                        job: {
                            userId,
                        },

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
                        job: {
                            userId,
                        },

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

                // Hired Current
                db.jobApplication.count({
                    where: {
                        job: {
                            userId,
                        },

                        status: "HIRED",

                        createdAt: {
                            gte: current30Days,
                        },
                    },
                }),

                // Hired Previous
                db.jobApplication.count({
                    where: {
                        job: {
                            userId,
                        },

                        status: "HIRED",

                        createdAt: {
                            gte: previous30Days,

                            lt: current30Days,
                        },
                    },
                }),
            ]);

            // Growth
            const postedJobsGrowth =
                calculateGrowth(
                    currentPostedJobsCount,
                    previousPostedJobsCount
                );

            const applicantsGrowth =
                calculateGrowth(
                    currentApplicantsCount,
                    previousApplicantsCount
                );

            const interviewsGrowth =
                calculateGrowth(
                    currentInterviewsCount,
                    previousInterviewsCount
                );

            const hiredGrowth =
                calculateGrowth(
                    currentHiredCount,
                    previousHiredCount
                );

            // Tables Data
            const [
                postedJobs,
                postedJobsTotal,

                applicants,
                applicantsTotal,

                interviews,
                interviewsTotal,

                hiredCandidates,
                hiredCandidatesTotal,
            ] = await Promise.all([
                // Posted Jobs
                db.job.findMany({
                    where: {
                        userId,
                    },

                    include: {
                        company: true,

                        _count: {
                            select: {
                                jobApplications:
                                    true,
                            },
                        },
                    },

                    orderBy: {
                        createdAt: "desc",
                    },

                    skip: postedJobsSkip,

                    take: limit,
                }),

                db.job.count({
                    where: {
                        userId,
                    },
                }),

                // Applicants
                db.jobApplication.findMany({
                    where: {
                        job: {
                            userId,
                        },
                    },

                    include: {
                        user: true,

                        job: true,
                    },

                    orderBy: {
                        createdAt: "desc",
                    },

                    skip: applicantsSkip,

                    take: limit,
                }),

                db.jobApplication.count({
                    where: {
                        job: {
                            userId,
                        },
                    },
                }),

                // Interviews
                db.jobApplication.findMany({
                    where: {
                        job: {
                            userId,
                        },

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
                        user: true,

                        job: true,
                    },

                    orderBy: {
                        updatedAt: "desc",
                    },

                    skip: interviewsSkip,

                    take: limit,
                }),

                db.jobApplication.count({
                    where: {
                        job: {
                            userId,
                        },

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

                // Hired
                db.jobApplication.findMany({
                    where: {
                        job: {
                            userId,
                        },

                        status: "HIRED",
                    },

                    include: {
                        user: true,

                        job: true,
                    },

                    orderBy: {
                        updatedAt: "desc",
                    },

                    skip: hiredSkip,

                    take: limit,
                }),

                db.jobApplication.count({
                    where: {
                        job: {
                            userId,
                        },

                        status: "HIRED",
                    },
                }),
            ]);

            // Overview Data
            const recentApplicants =
                applicants.slice(0, 5);

            const recentActivity =
                applicants.slice(0, 5);

            // Final Return
            return {
                // KPI Stats
                stats: {
                    postedJobsCount: {
                        count:
                            currentPostedJobsCount,

                        growth:
                            postedJobsGrowth.growth,

                        isPositive:
                            postedJobsGrowth.isPositive,

                        chartData: [],
                    },

                    totalApplicationsCount:
                    {
                        count:
                            currentApplicantsCount,

                        growth:
                            applicantsGrowth.growth,

                        isPositive:
                            applicantsGrowth.isPositive,

                        chartData: [],
                    },

                    interviewsCount: {
                        count:
                            currentInterviewsCount,

                        growth:
                            interviewsGrowth.growth,

                        isPositive:
                            interviewsGrowth.isPositive,

                        chartData: [],
                    },

                    hiredCandidatesCount:
                    {
                        count:
                            currentHiredCount,

                        growth:
                            hiredGrowth.growth,

                        isPositive:
                            hiredGrowth.isPositive,

                        chartData: [],
                    },
                },

                // Charts
                charts: {
                    hiringStatusChart:
                        [],

                    applicantsActivityChart:
                        [],
                },

                // Overview
                recentApplicants,

                recentActivity,

                // Posted Jobs Tab
                postedJobs: {
                    data: postedJobs,

                    total:
                        postedJobsTotal,

                    page:
                        postedJobsPage,

                    totalPages:
                        Math.ceil(
                            postedJobsTotal /
                            limit
                        ),
                },

                // Applicants Tab
                applicants: {
                    data: applicants,

                    total:
                        applicantsTotal,

                    page:
                        applicantsPage,

                    totalPages:
                        Math.ceil(
                            applicantsTotal /
                            limit
                        ),
                },

                // Interviews Tab
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

                // Hired Tab
                hiredCandidates: {
                    data: hiredCandidates,

                    total:
                        hiredCandidatesTotal,

                    page: hiredPage,

                    totalPages:
                        Math.ceil(
                            hiredCandidatesTotal /
                            limit
                        ),
                },
            };
        },

        ["recruiter-dashboard-data"],

        {
            revalidate: 60,

            tags: [
                "recruiter-dashboard",
            ],
        }
    );