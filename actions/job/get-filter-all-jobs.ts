"use server";

import { db } from "@/lib/db";
import { SearchParams } from "@/types";
import { Prisma } from "@prisma/client";
import { searchJobIds } from "../searchJobs";
import { AIJobMatchResult } from "../ai/jobs/get-job-ai-matches";

export type FilteredJob = Prisma.JobGetPayload<{
    select: {
        id: true;
        userId: true;
        companyId: true;

        jobTitle: true;
        jobDesc: true;
        experience: true;

        city: true;
        state: true;
        country: true;

        type: true;
        mode: true;
        skills: true;

        isEasyApply: true;
        applyLink: true;
        questions: true;

        createdAt: true;

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

        _count: {
            select: {
                jobApplications: true;
            };
        };
    };
}>

export type JobWithAI = FilteredJob & {
    aiMatch: AIJobMatchResult | null;
};

const ITEMS_PER_PAGE = 10;

const DAY_MS = 86_400_000;

const DATE_POSTED_DAYS: Record<string, number> = {
    "Past 24 hours": 1,
    "Past 3 days": 3,
    "Past Week": 7,
    "Past Month": 30,
};

export async function getFilteredJobs(
    params: SearchParams
): Promise<{
    jobs: FilteredJob[];
    count: number;
}> {
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

    const trimmedQuery = q?.trim();
    const trimmedCompany = company?.trim();
    const trimmedLocation = location?.trim();

    try {
        const where: Prisma.JobWhereInput = {};

        // Search
        if (trimmedQuery) {
            const ids = await searchJobIds(trimmedQuery);

            where.id = {
                in: ids.length > 0 ? ids : [-1],
            };
        }

        // Easy Apply
        if (easyApply === "true") {
            where.isEasyApply = true;
        }

        // Company
        if (trimmedCompany) {
            where.company = {
                companyName: {
                    contains: trimmedCompany,
                    mode: "insensitive",
                },
            };
        }

        // Date Posted
        if (dateposted) {
            const days = DATE_POSTED_DAYS[dateposted];

            if (days) {
                where.createdAt = {
                    gte: new Date(
                        Date.now() - days * DAY_MS
                    ),
                };
            }
        }

        // Job Type / Mode
        if (type) {
            where.mode = type;
        }

        // Experience
        if (experiencelevel) {
            where.experience = experiencelevel;
        }

        // Location
        if (trimmedLocation) {
            where.OR = [
                {
                    city: {
                        contains: trimmedLocation,
                        mode: "insensitive",
                    },
                },
                {
                    state: {
                        contains: trimmedLocation,
                        mode: "insensitive",
                    },
                },
                {
                    country: {
                        contains: trimmedLocation,
                        mode: "insensitive",
                    },
                },
            ];
        }

        // Exclude:
        // 1. Current user's own jobs
        // 2. Jobs belonging to current user's company
        // 3. Jobs already applied to by current user
        if (userId !== undefined) {
            where.NOT = [
                {
                    userId,
                },
                {
                    company: {
                        userId,
                    },
                },
                {
                    jobApplications: {
                        some: {
                            userId,
                        },
                    },
                },
            ];
        }

        const skip =
            (currentPage - 1) * ITEMS_PER_PAGE;

        const [count, rawJobs] = await Promise.all([
            db.job.count({
                where,
            }),

            db.job.findMany({
                where,

                select: {
                    id: true,
                    userId: true,
                    companyId: true,

                    jobTitle: true,
                    jobDesc: true,
                    experience: true,

                    city: true,
                    state: true,
                    country: true,

                    type: true,
                    mode: true,
                    skills: true,

                    isEasyApply: true,
                    applyLink: true,
                    questions: true,

                    createdAt: true,

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

                    _count: {
                        select: {
                            jobApplications: true,
                        },
                    },
                },

                orderBy: {
                    createdAt: "desc",
                },

                take: ITEMS_PER_PAGE,
                skip,
            }),
        ]);

        return {
            jobs: rawJobs,
            count,
        };
    } catch (error) {
        console.error("❌ getFilteredJobs:", error);

        throw new Error("Failed to fetch jobs");
    }
}