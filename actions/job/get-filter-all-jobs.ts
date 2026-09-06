// FILE: actions/job/get-filter-all-jobs.ts
"use server";

import { db } from "@/lib/db";
import { SearchParams } from "@/types";
import { Prisma } from "@prisma/client";
import { searchJobIds } from "../searchJobs";
import type { AIJobMatchResult } from "@/actions/ai/jobs/get-job-ai-matches";

// ─── Type ─────────────────────────────────────────────────────────────────────

export type FilteredJob = Prisma.JobGetPayload<{
    include: {
        user: {
            select: {
                id: true; username: true; profileImage: true;
                profession: true; role: true; isPro: true;
            };
        };
        company: {
            select: {
                id: true; userId: true; companyName: true; companyImage: true;
                companyAbout: true; companyTotalEmployees: true; companyIsVerified: true;
            };
        };
        jobApplications: { select: { userId: true } };
        _count: { select: { jobApplications: true } };
    };
}> & {
    // null on SSR — attached client-side by JobsClient after AI call returns
    aiMatch: AIJobMatchResult | null;
};

const ITEMS_PER_PAGE = 10;

// ─── Action ───────────────────────────────────────────────────────────────────

export async function getFilteredJobs(
    params: SearchParams
): Promise<{ jobs: FilteredJob[]; count: number }> {
    const {
        userId, page = 1, q, easyApply,
        dateposted, experiencelevel, type, location, company,
    } = params;

    const currentPage = Math.max(1, page);

    try {
        const where: Prisma.JobWhereInput = {};

        if (q?.trim()) {
            const ids = await searchJobIds(q.trim());
            where.id = { in: ids.length ? ids : [-1] };
        }

        if (easyApply === "true") where.isEasyApply = true;

        if (company?.trim()) {
            where.company = { companyName: { contains: company.trim(), mode: "insensitive" } };
        }

        if (dateposted) {
            const dayMap: Record<string, number> = {
                "Past 24 hours": 1, "Past 3 days": 3,
                "Past Week": 7, "Past Month": 30,
            };
            const days = dayMap[dateposted];
            if (days) where.createdAt = { gte: new Date(Date.now() - days * 86_400_000) };
        }

        if (type) where.mode = type;
        if (experiencelevel) where.experience = experiencelevel;

        if (location?.trim()) {
            where.OR = [
                { city: { contains: location.trim(), mode: "insensitive" } },
                { state: { contains: location.trim(), mode: "insensitive" } },
                { country: { contains: location.trim(), mode: "insensitive" } },
            ];
        }

        if (userId !== undefined) {
            where.NOT = [
                { userId },
                { company: { userId } },
                { jobApplications: { some: { userId } } },
            ];
        }

        // ✅ NO AI CALL HERE — page always loads from DB only
        const [count, rawJobs] = await Promise.all([
            db.job.count({ where }),
            db.job.findMany({
                where,
                orderBy: { createdAt: "desc" },
                take: ITEMS_PER_PAGE,
                skip: (currentPage - 1) * ITEMS_PER_PAGE,
                include: {
                    user: {
                        select: {
                            id: true, username: true, profileImage: true,
                            profession: true, role: true, isPro: true,
                        },
                    },
                    company: {
                        select: {
                            id: true, userId: true, companyName: true, companyImage: true,
                            companyAbout: true, companyTotalEmployees: true, companyIsVerified: true,
                        },
                    },
                    jobApplications: { select: { userId: true } },
                    _count: { select: { jobApplications: true } },
                },
            }),
        ]);

        // aiMatch = null — JobsClient fills this in after the AI route responds
        const jobs = rawJobs.map((j) => ({ ...j, aiMatch: null })) as FilteredJob[];

        return { jobs, count };
    } catch (error) {
        console.error("❌ getFilteredJobs:", error);
        throw new Error("Failed to fetch jobs");
    }
}