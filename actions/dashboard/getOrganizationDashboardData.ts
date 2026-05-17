"use server";

import { db } from "@/lib/db";

import { dashboardJobInclude } from "@/lib/dashboard-includes";

export const getOrganizationDashboardData =
    async (userId: number) => {
        try {
            if (!userId) {
                return {
                    success: false,
                    error: "Unauthorized",
                };
            }

            // Company
            const company =
                await db.company.findFirst({
                    where: {
                        userId,
                    },
                });

            if (!company) {
                return {
                    success: false,
                    error: "Company not found",
                };
            }

            const [
                postedJobs,

                jobsCount,
                applicantsCount,

                // Placeholder until recruiter system built
                recruitersCount,

                // Placeholder until employees system built
                employeesCount,
            ] = await Promise.all([
                // Posted Jobs
                db.job.findMany({
                    where: {
                        companyId: company.id,
                    },

                    include: {
                        ...dashboardJobInclude,

                        jobApplications: {
                            select: {
                                id: true,
                            },
                        },
                    },

                    orderBy: {
                        createdAt: "desc",
                    },

                    take: 10,
                }),

                // Jobs Count
                db.job.count({
                    where: {
                        companyId: company.id,
                    },
                }),

                // Applicants
                db.jobApplication.count({
                    where: {
                        job: {
                            companyId: company.id,
                        },
                    },
                }),

                // Placeholder
                Promise.resolve(0),

                // Placeholder
                Promise.resolve(0),
            ]);

            return {
                success: true,

                data: {
                    company,

                    postedJobs,

                    analytics: {
                        companyHiringTrend: [],
                        recruitersPerformance: [],
                    },

                    counts: {
                        jobs: jobsCount,

                        recruiters:
                            recruitersCount,

                        employees:
                            employeesCount,

                        applicants:
                            applicantsCount,
                    },
                },
            };
        } catch (error) {
            console.error(
                "GET_ORGANIZATION_DASHBOARD_DATA_ERROR",
                error
            );

            return {
                success: false,
                error:
                    "Failed to fetch organization dashboard data",
            };
        }
    };