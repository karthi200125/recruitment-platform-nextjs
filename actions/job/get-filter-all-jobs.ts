"use server";

import { unstable_cache } from "next/cache";
import { db } from "@/lib/db";
import { SearchParams } from "@/types";
import { Prisma } from "@prisma/client";
import { searchJobIds } from "../searchJobs";
import { AIJobMatchResult } from "../ai/jobs/get-job-ai-matches";

// ─────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────

const ITEMS_PER_PAGE = 10;
const DAY_MS = 86_400_000;

const DEBUG = process.env.JOBS_DEBUG === "1";

const DATE_POSTED_DAYS: Record<string, number> = {
    "Past 24 hours": 1,
    "Past 3 days": 3,
    "Past Week": 7,
    "Past Month": 30,
};

// ─────────────────────────────────────────────────────────────
// Select
// ─────────────────────────────────────────────────────────────

const JOB_SELECT = {
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
} satisfies Prisma.JobSelect;

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

export type FilteredJob = Prisma.JobGetPayload<{
    select: typeof JOB_SELECT;
}>;

export type JobWithAI = FilteredJob & {
    aiMatch: AIJobMatchResult | null;
};

// ─────────────────────────────────────────────────────────────
// Timing helper
// ─────────────────────────────────────────────────────────────

async function timed<T>(
    label: string,
    fn: () => Promise<T>
): Promise<T> {
    if (!DEBUG) {
        return fn();
    }

    const start = performance.now();

    try {
        return await fn();
    } finally {
        const duration = performance.now() - start;

        console.log(
            `JOBS: ${label} ${duration.toFixed(0)}ms`
        );
    }
}

// ─────────────────────────────────────────────────────────────
// Build WHERE
// ─────────────────────────────────────────────────────────────

async function buildWhere(
    params: SearchParams
): Promise<Prisma.JobWhereInput> {
    const {
        userId,
        q,
        easyApply,
        dateposted,
        experiencelevel,
        type,
        location,
        company,
    } = params;

    const trimmedQuery = q?.trim();
    const trimmedCompany = company?.trim();
    const trimmedLocation = location?.trim();

    const where: Prisma.JobWhereInput = {};

    // ─────────────────────────────────────────────────────────
    // Search
    // ─────────────────────────────────────────────────────────

    if (trimmedQuery) {
        const ids = await timed(
            "searchJobIds",
            () => searchJobIds(trimmedQuery)
        );

        where.id = {
            in: ids.length > 0 ? ids : [-1],
        };
    }

    // ─────────────────────────────────────────────────────────
    // Easy Apply
    // ─────────────────────────────────────────────────────────

    if (easyApply === "true") {
        where.isEasyApply = true;
    }

    // ─────────────────────────────────────────────────────────
    // Company
    // ─────────────────────────────────────────────────────────

    if (trimmedCompany) {
        where.company = {
            companyName: {
                contains: trimmedCompany,
                mode: "insensitive",
            },
        };
    }

    // ─────────────────────────────────────────────────────────
    // Date Posted
    // ─────────────────────────────────────────────────────────

    if (dateposted) {
        const days = DATE_POSTED_DAYS[dateposted];

        if (days) {
            where.createdAt = {
                gte: new Date(Date.now() - days * DAY_MS),
            };
        }
    }

    // ─────────────────────────────────────────────────────────
    // Job Type
    // ─────────────────────────────────────────────────────────

    if (type) {
        where.mode = type;
    }

    // ─────────────────────────────────────────────────────────
    // Experience
    // ─────────────────────────────────────────────────────────

    if (experiencelevel) {
        where.experience = experiencelevel;
    }

    // ─────────────────────────────────────────────────────────
    // Location
    // ─────────────────────────────────────────────────────────

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

    // ─────────────────────────────────────────────────────────
    // Hide user's own jobs/company jobs/applied jobs
    // ─────────────────────────────────────────────────────────

    if (userId !== undefined) {
        where.AND = [
            {
                userId: {
                    not: userId,
                },
            },
            {
                company: {
                    is: {
                        userId: {
                            not: userId,
                        },
                    },
                },
            },
            {
                jobApplications: {
                    none: {
                        userId,
                    },
                },
            },
        ];
    }

    return where;
}

// ─────────────────────────────────────────────────────────────
// Cached count
// ─────────────────────────────────────────────────────────────
//
// IMPORTANT:
// Search queries are NOT cached here.
// Text search can have a different ID list, so q is handled
// separately in getFilteredJobs().
//
// ─────────────────────────────────────────────────────────────

type CountParams = Omit<SearchParams, "q" | "page">;

const getCachedCount = unstable_cache(
    async (params: CountParams) => {
        const where = await buildWhere(params);

        return db.job.count({
            where,
        });
    },
    ["jobs-count-v2"],
    {
        revalidate: 60,
        tags: ["jobs"],
    }
);

// ─────────────────────────────────────────────────────────────
// Main query
// ─────────────────────────────────────────────────────────────

export async function getFilteredJobs(
    params: SearchParams
): Promise<{
    jobs: FilteredJob[];
    count: number;
    savedJobIds: number[];
}> {
    const {
        userId,
        q,
    } = params;

    const currentPage = Math.max(
        1,
        params.page ?? 1
    );

    const skip =
        (currentPage - 1) * ITEMS_PER_PAGE;

    try {
        // ─────────────────────────────────────────────────────
        // Build filters
        // ─────────────────────────────────────────────────────

        const where = await timed(
            "buildWhere",
            () => buildWhere(params)
        );

        // ─────────────────────────────────────────────────────
        // Count
        // ─────────────────────────────────────────────────────

        const countPromise = q?.trim()
            ? timed(
                "count",
                () =>
                    db.job.count({
                        where,
                    })
            )
            : timed(
                "count(cached)",
                () =>
                    getCachedCount({
                        userId: params.userId,
                        easyApply: params.easyApply,
                        dateposted: params.dateposted,
                        experiencelevel:
                            params.experiencelevel,
                        type: params.type,
                        location:
                            params.location?.trim(),
                        company:
                            params.company?.trim(),
                    })
            );

        // ─────────────────────────────────────────────────────
        // Jobs
        // ─────────────────────────────────────────────────────

        const rowsPromise = timed(
            "findMany",
            () =>
                db.job.findMany({
                    where,

                    select: {
                        ...JOB_SELECT,

                        // Get saved state together with jobs.
                        // This avoids 10 separate isSaved() calls.
                        savedBy: {
                            where: {
                                userId: userId ?? -1,
                            },
                            select: {
                                id: true,
                            },
                            take: 1,
                        },
                    },

                    orderBy: {
                        createdAt: "desc",
                    },

                    skip,

                    take: ITEMS_PER_PAGE,                                        
                })
        );

        // ─────────────────────────────────────────────────────
        // Run count + jobs concurrently
        // ─────────────────────────────────────────────────────

        const [count, rows] = await Promise.all([
            countPromise,
            rowsPromise,
        ]);

        // ─────────────────────────────────────────────────────
        // Convert savedBy -> savedJobIds
        // ─────────────────────────────────────────────────────

        const savedJobIds: number[] = [];

        const jobs = rows.map(
            ({ savedBy, ...job }) => {
                if (savedBy.length > 0) {
                    savedJobIds.push(job.id);
                }

                return job;
            }
        );

        if (DEBUG) {
            console.log("JOBS: result", {
                page: currentPage,
                skip,
                take: ITEMS_PER_PAGE,
                count,
                jobsReturned: jobs.length,
                savedJobs: savedJobIds.length,
            });
        }

        return {
            jobs,
            count,
            savedJobIds,
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