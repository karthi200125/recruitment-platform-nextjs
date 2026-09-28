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
}>;

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
    savedJobIds: number[];
}> {
    console.time("JOBS: TOTAL");

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

    console.log("JOBS: params", {
        userId,
        page,
        q,
        easyApply,
        dateposted,
        experiencelevel,
        type,
        location,
        company,
    });

    const currentPage = Math.max(1, page);

    const trimmedQuery = q?.trim();
    const trimmedCompany = company?.trim();
    const trimmedLocation = location?.trim();

    try {
        // ============================================================
        // 1. BUILD WHERE CLAUSE
        // ============================================================

        console.time("JOBS: buildWhere");

        const where: Prisma.JobWhereInput = {};

        // Search
        if (trimmedQuery) {
            console.time("JOBS: searchJobIds");

            const ids = await searchJobIds(trimmedQuery);

            console.timeEnd("JOBS: searchJobIds");

            console.log(
                "JOBS: searchJobIds result count:",
                ids.length
            );

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

        console.timeEnd("JOBS: buildWhere");

        // ============================================================
        // 2. PAGINATION
        // ============================================================

        const skip =
            (currentPage - 1) * ITEMS_PER_PAGE;

        console.log("JOBS: pagination", {
            currentPage,
            skip,
            take: ITEMS_PER_PAGE,
        });

        // ============================================================
        // 3. DATABASE COUNT
        // ============================================================

        console.time("JOBS: db.count");

        const countPromise = db.job.count({
            where,
        });

        // ============================================================
        // 4. DATABASE FIND MANY
        // ============================================================

        console.time("JOBS: db.findMany");

        const jobsPromise = db.job.findMany({
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
        });

        // ============================================================
        // 5. WAIT FOR COUNT + JOBS
        // ============================================================

        const [count, rawJobs] = await Promise.all([
            countPromise,
            jobsPromise,
        ]);

        console.timeEnd("JOBS: db.count");
        console.timeEnd("JOBS: db.findMany");

        console.log("JOBS: DB result", {
            count,
            jobsReturned: rawJobs.length,
            jobIds: rawJobs.map((job) => job.id),
        });

        // ============================================================
        // 6. GET SAVED JOB IDS
        // ============================================================

        let savedJobIds: number[] = [];

        if (
            userId !== undefined &&
            rawJobs.length > 0
        ) {
            console.time(
                "JOBS: db.savedJob.findMany"
            );

            const savedJobs =
                await db.savedJob.findMany({
                    where: {
                        userId,
                        jobId: {
                            in: rawJobs.map(
                                (job) => job.id
                            ),
                        },
                    },

                    select: {
                        jobId: true,
                    },
                });

            console.timeEnd(
                "JOBS: db.savedJob.findMany"
            );

            savedJobIds = savedJobs.map(
                (savedJob) => savedJob.jobId
            );

            console.log(
                "JOBS: savedJobIds",
                savedJobIds
            );
        } else {
            console.log(
                "JOBS: savedJob query skipped",
                {
                    hasUserId:
                        userId !== undefined,
                    jobsReturned:
                        rawJobs.length,
                }
            );
        }

        // ============================================================
        // 7. FINAL RESULT
        // ============================================================

        console.log("JOBS: FINAL", {
            jobs: rawJobs.length,
            count,
            savedJobIds: savedJobIds.length,
        });

        console.timeEnd("JOBS: TOTAL");

        return {
            jobs: rawJobs,
            count,
            savedJobIds,
        };
    } catch (error) {
        console.error(
            "❌ getFilteredJobs ERROR:",
            error
        );

        console.timeEnd("JOBS: TOTAL");

        throw new Error(
            "Failed to fetch jobs"
        );
    }
}