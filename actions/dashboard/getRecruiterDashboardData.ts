"use server";

import { db } from "@/lib/db";

import { dashboardJobInclude } from "@/lib/dashboard-includes";

import { ApplicationStatus } from "@prisma/client";

export const getRecruiterDashboardData =
    async (userId: number) => {
        try {
            if (!userId) {
                return {
                    success: false,
                    error: "Unauthorized",
                };
            }

            const [
                postedJobs,

                postedJobsCount,
                totalApplicants,
                shortlistedApplicants,
                interviewApplicants,
            ] = await Promise.all([
                // Posted Jobs
                db.job.findMany({
                    where: {
                        userId,
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

                // Posted Jobs Count
                db.job.count({
                    where: {
                        userId,
                    },
                }),

                // Applicants
                db.jobApplication.count({
                    where: {
                        job: {
                            userId,
                        },
                    },
                }),

                // Shortlisted
                db.jobApplication.count({
                    where: {
                        job: {
                            userId,
                        },

                        status:
                            ApplicationStatus.SHORTLISTED,
                    },
                }),

                // Interviews
                db.jobApplication.count({
                    where: {
                        job: {
                            userId,
                        },

                        status: {
                            in: [
                                ApplicationStatus.INTERVIEW_SCHEDULED,
                                ApplicationStatus.INTERVIEWED,
                            ],
                        },
                    },
                }),
            ]);

            return {
                success: true,

                data: {
                    postedJobs,

                    analytics: {
                        hiringTrend: [],
                        applicantsTrend: [],
                    },

                    counts: {
                        postedJobs:
                            postedJobsCount,

                        applicants:
                            totalApplicants,

                        shortlisted:
                            shortlistedApplicants,

                        interviews:
                            interviewApplicants,
                    },
                },
            };
        } catch (error) {
            console.error(
                "GET_RECRUITER_DASHBOARD_DATA_ERROR",
                error
            );

            return {
                success: false,
                error:
                    "Failed to fetch recruiter dashboard data",
            };
        }
    };