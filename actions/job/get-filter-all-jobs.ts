"use server";

import { db } from "@/lib/db";
import { SearchParams } from "@/types";
import { Prisma } from "@prisma/client";
import { searchJobIds } from "../searchJobs";
import type { AIJobMatchResult } from "@/actions/ai/jobs/get-job-ai-matches";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

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

        // Keep this because existing UI uses jobApplications.
        //
        // IMPORTANT:
        // We only select userId instead of loading the entire
        // JobApplication records.
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
    // AI matching is attached client-side.
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

// ─────────────────────────────────────────────────────────────────────────────
// Action
// ─────────────────────────────────────────────────────────────────────────────

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

        // ─────────────────────────────────────────────────────────────
        // Search
        // ─────────────────────────────────────────────────────────────

        if (trimmedQuery) {
            const ids = await searchJobIds(trimmedQuery);

            where.id = {
                in: ids.length > 0 ? ids : [-1],
            };
        }

        // ─────────────────────────────────────────────────────────────
        // Filters
        // ─────────────────────────────────────────────────────────────

        if (easyApply === "true") {
            where.isEasyApply = true;
        }

        if (trimmedCompany) {
            where.company = {
                companyName: {
                    contains: trimmedCompany,
                    mode: "insensitive",
                },
            };
        }

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

        if (type) {
            where.mode = type;
        }

        if (experiencelevel) {
            where.experience = experiencelevel;
        }

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

        // ─────────────────────────────────────────────────────────────
        // Exclude current user's own jobs / company jobs / applications
        // ─────────────────────────────────────────────────────────────

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

        // ─────────────────────────────────────────────────────────────
        // Pagination
        // ─────────────────────────────────────────────────────────────

        const skip =
            (currentPage - 1) * ITEMS_PER_PAGE;

        // ─────────────────────────────────────────────────────────────
        // Database queries
        // ─────────────────────────────────────────────────────────────

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

                    // Keep only what the current UI needs.
                    //
                    // This is much lighter than:
                    //
                    // jobApplications: true
                    //
                    jobApplications: {
                        select: {
                            userId: true,
                        },
                    },

                    // Gives the total application count without
                    // transferring all application rows.
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

        // ─────────────────────────────────────────────────────────────
        // Attach initial AI state.
        //
        // JobsClient fills this after the AI request completes.
        // ─────────────────────────────────────────────────────────────

        const jobs: FilteredJob[] =
            rawJobs.map((job) => ({
                ...job,
                aiMatch: null,
            }));

        return {
            jobs,
            count,
        };
    } catch (error) {
        console.error(
            "❌ getFilteredJobs:",
            error
        );

        throw new Error(
            "Failed to fetch jobs"
        );
    }
}