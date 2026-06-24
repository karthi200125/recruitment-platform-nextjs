"use server";

import { unstable_cache } from "next/cache";

import { subDays } from "date-fns";

import { db } from "@/lib/db";
import { calculateGrowth } from "./calculate-growth";



// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

interface Props {
    companyId: number;

    jobsPage?: number;

    applicantsPage?: number;

    hiredPage?: number;

    limit?: number;
}

// ─────────────────────────────────────────────
// Action
// ─────────────────────────────────────────────

export const getOrganizationDashboardData =
    unstable_cache(
        async ({
            companyId,

            jobsPage = 1,

            applicantsPage = 1,

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
            const jobsSkip =
                (jobsPage - 1) * limit;

            const applicantsSkip =
                (applicantsPage - 1) *
                limit;

            const hiredSkip =
                (hiredPage - 1) * limit;

            // KPI Counts
            const [
                currentJobsCount,
                previousJobsCount,

                currentApplicantsCount,
                previousApplicantsCount,

                currentRecruitersCount,
                previousRecruitersCount,

                currentHiredCount,
                previousHiredCount,
            ] = await Promise.all([
                // Jobs Current
                db.job.count({
                    where: {
                        companyId,

                        createdAt: {
                            gte: current30Days,
                        },
                    },
                }),

                // Jobs Previous
                db.job.count({
                    where: {
                        companyId,

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
                            companyId,
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
                            companyId,
                        },

                        createdAt: {
                            gte: previous30Days,

                            lt: current30Days,
                        },
                    },
                }),

                // Recruiters Current
                db.user.count({
                    where: {
                        role: "RECRUITER",

                        companyId,

                        createdAt: {
                            gte: current30Days,
                        },
                    },
                }),

                // Recruiters Previous
                db.user.count({
                    where: {
                        role: "RECRUITER",

                        companyId,

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
                            companyId,
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
                            companyId,
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
            const jobsGrowth =
                calculateGrowth(
                    currentJobsCount,
                    previousJobsCount
                );

            const applicantsGrowth =
                calculateGrowth(
                    currentApplicantsCount,
                    previousApplicantsCount
                );

            const recruitersGrowth =
                calculateGrowth(
                    currentRecruitersCount,
                    previousRecruitersCount
                );

            const hiredGrowth =
                calculateGrowth(
                    currentHiredCount,
                    previousHiredCount
                );

            // Tables Data
            const [
                jobs,
                jobsTotal,

                applicants,
                applicantsTotal,

                hiredCandidates,
                hiredCandidatesTotal,
            ] = await Promise.all([
                // Jobs
                db.job.findMany({
                    where: {
                        companyId,
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

                    skip: jobsSkip,

                    take: limit,
                }),

                db.job.count({
                    where: {
                        companyId,
                    },
                }),

                // Applicants
                db.jobApplication.findMany({
                    where: {
                        job: {
                            companyId,
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
                            companyId,
                        },
                    },
                }),

                // Hired
                db.jobApplication.findMany({
                    where: {
                        job: {
                            companyId,
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
                            companyId,
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
                    jobsCount: {
                        count:
                            currentJobsCount,

                        growth:
                            jobsGrowth.growth,

                        isPositive:
                            jobsGrowth.isPositive,

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

                    recruitersCount: {
                        count:
                            currentRecruitersCount,

                        growth:
                            recruitersGrowth.growth,

                        isPositive:
                            recruitersGrowth.isPositive,

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
                    companyHiringChart:
                        [],

                    recruitersPerformanceChart:
                        [],
                },

                // Overview
                recentApplicants,

                recentActivity,

                // Jobs Tab
                jobs: {
                    data: jobs,

                    total: jobsTotal,

                    page: jobsPage,

                    totalPages:
                        Math.ceil(
                            jobsTotal /
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

        ["organization-dashboard-data"],

        {
            revalidate: 60,

            tags: [
                "organization-dashboard",
            ],
        }
    );