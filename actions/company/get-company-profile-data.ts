"use server";

import { cache } from "react";
import { db } from "@/lib/db";

export const getCompanyProfileData = cache(
    async (
        companyUserId: number,
        currentUserId?: number
    ) => {
        const companyData = await db.user.findUnique({
            where: {
                id: companyUserId,
                role: "ORGANIZATION",
            },

            select: {
                company: {
                    select: {
                        id: true,
                        companyName: true,
                        companyImage: true,
                        companyAbout: true,
                        companyTotalEmployees: true,
                        companyIsVerified: true,

                        jobs: {
                            orderBy: {
                                createdAt: "desc",
                            },

                            take: 6,

                            select: {
                                id: true,
                                jobTitle: true,
                                jobDesc: true,
                                city: true,
                                state: true,
                                country: true,
                                type: true,
                                mode: true,
                                experience: true,
                                skills: true,
                                isEasyApply: true,
                                applyLink: true,
                                createdAt: true,
                            },
                        },

                        employees: {
                            where: {
                                status: "ACCEPTED",
                            },

                            select: {
                                id: true,
                                user: {
                                    select: {
                                        id: true,
                                        username: true,
                                        userImage: true,
                                        profileImage: true,
                                        firstName: true,
                                        lastName: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        if (!companyData?.company) {
            return null;
        }

        let savedJobIds: number[] = [];

        if (
            currentUserId !== undefined &&
            companyData.company.jobs.length > 0
        ) {
            const jobIds = companyData.company.jobs.map(
                (job) => job.id
            );

            const savedJobs = await db.savedJob.findMany({
                where: {
                    userId: currentUserId,
                    jobId: {
                        in: jobIds,
                    },
                },

                select: {
                    jobId: true,
                },
            });

            savedJobIds = savedJobs.map(
                (savedJob) => savedJob.jobId
            );
        }

        return {
            ...companyData,
            savedJobIds,
        };
    }
);