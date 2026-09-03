import { db } from "@/lib/db";
import { SearchParams } from "@/types";
import { Prisma } from "@prisma/client";
import { cache } from "react";
import { searchJobIds } from "../searchJobs";
import { getJobAIMatches } from "../ai/jobs/get-job-ai-matches";
import type { AIJobMatchResult } from "@/actions/ai/jobs/get-job-ai-matches";

export type FilteredJob = Prisma.JobGetPayload<{
    include: {
        user: {
            select: {
                id: true;
                username: true;
                profileImage: true;
                profession: true;
                role: true;
                isPro: true;
            };
        };

        company: {
            select: {
                id: true;
                userId: true;

                companyName: true;
                companyImage: true;

                companyAbout: true;
                companyTotalEmployees: true;
                companyIsVerified: true;
            };
        };

        jobApplications: {
            select: {
                userId: true;
            };
        };

        _count: {
            select: {
                jobApplications: true;
            };
        };
    };
}> & {
    aiMatch: AIJobMatchResult | null;
};


const ITEM_PER_PAGE = 10;

export const getFilteredJobs = cache(
    async (
        params: SearchParams
    ): Promise<{
        jobs: FilteredJob[];
        count: number;
    }> => {
        const {
            userId,
            page = 1,
            q,
            easyApply,
            dateposted,
            experiencelevel,
            type,
            location,
            company,
        } = params;


        const currentPage = Math.max(1, page);

        try {

            const where: Prisma.JobWhereInput = {};

            if (q) {

                const matchedJobIds = await searchJobIds(q);

                where.id = {
                    in: matchedJobIds.length
                        ? matchedJobIds
                        : [-1],
                };
            }


            if (easyApply === "true") {
                where.isEasyApply = true;
            }


            if (company) {
                where.company = {
                    companyName: {
                        contains: company,
                        mode: "insensitive",
                    },
                };
            }


            if (dateposted) {
                const now = new Date();

                const dateMap: Record<string, number> = {
                    "Past 24 hours": 1,
                    "Past 3 days": 3,
                    "Past Week": 7,
                    "Past Month": 30,
                };

                const days = dateMap[dateposted];

                if (days) {
                    where.createdAt = {
                        gte: new Date(now.getTime() - days * 86400000),
                    };
                }
            }



            if (type) {
                where.mode = type;
            }


            if (experiencelevel) {
                where.experience = experiencelevel;
            }

            if (location) {
                where.OR = [
                    { city: { contains: location, mode: "insensitive" } },
                    { state: { contains: location, mode: "insensitive" } },
                    { country: { contains: location, mode: "insensitive" } },
                ];
            }


            if (userId !== undefined) {
                where.NOT = [
                    { userId },
                    {
                        company: {
                            userId,
                        },
                    },
                    {
                        jobApplications: {
                            some: { userId },
                        },
                    },
                ];
            }


            const totalCount = await db.job.count({ where });


            const jobs = await db.job.findMany({
                where,
                orderBy: {
                    createdAt: "desc",
                },
                take: ITEM_PER_PAGE,
                skip: (currentPage - 1) * ITEM_PER_PAGE,

                include: {
                    user: {
                        select: {
                            id: true,
                            username: true,
                            profileImage: true,
                            profession: true,
                            role: true,
                            isPro: true,
                        },
                    },
                    company: {
                        select: {
                            id: true,
                            userId: true,

                            companyName: true,
                            companyImage: true,

                            companyAbout: true,
                            companyTotalEmployees: true,
                            companyIsVerified: true,
                        },
                    },

                    jobApplications: {
                        select: {
                            userId: true,
                        },
                    },

                    _count: {
                        select: {
                            jobApplications: true,
                        },
                    },
                },
            });

            let aiMatches = new Map<
                number,
                import("@/actions/ai/jobs/get-job-ai-matches").AIJobMatchResult
            >();

            if (userId !== undefined && jobs.length > 0) {
                try {
                    const aiUser = await db.user.findUnique({
                        where: {
                            id: userId,
                        },
                        select: {
                            profession: true,
                            skills: true,
                            city: true,
                            state: true,
                            country: true,

                            educations: {
                                select: {
                                    instituteName: true,
                                    degree: true,
                                    fieldOfStudy: true,
                                },
                            },

                            experiences: {
                                select: {
                                    companyName: true,
                                    position: true,
                                    description: true,
                                },
                            },

                            projects: {
                                select: {
                                    proName: true,
                                    proDesc: true,
                                },
                            },
                        },
                    });

                    if (aiUser) {
                        const matches = await getJobAIMatches(
                            aiUser,
                            jobs.map((job) => ({
                                id: job.id,
                                jobTitle: job.jobTitle,
                                jobDesc: job.jobDesc,
                                experience: job.experience,
                                city: job.city,
                                state: job.state,
                                country: job.country,
                                type: job.type,
                                mode: job.mode,
                                skills: job.skills,
                            }))
                        );

                        aiMatches = new Map(
                            matches.map((match) => [
                                match.jobId,
                                match,
                            ])
                        );
                    }
                } catch (error) {
                    console.error(
                        "❌ AI job matching failed:",
                        error
                    );
                }
            }

            const jobsWithAI = jobs.map((job) => ({
                ...job,
                aiMatch: aiMatches.get(job.id) ?? null,
            }));

            return {
                jobs: jobsWithAI,
                count: totalCount,
            };
        } catch (error) {
            console.error("❌ getFilteredJobs error:", error);
            throw new Error("Failed to fetch jobs");
        }
    }
);