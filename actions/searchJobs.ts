"use server";

import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

export interface JobSearchResult {
    id: number;
    jobTitle: string;
    companyName: string;
    companyImage: string | null;
    city: string;
    mode: string;
    salary: string;
    experience: string;
    isEasyApply: boolean;
}

export interface JobSuggestion {
    id: number;
    jobTitle: string;
    companyName: string;
    companyImage: string | null;
    city: string;
}

export async function searchJobs(query: string, location = "", limit = 10): Promise<JobSearchResult[]> {
    const q = query.trim();
    const loc = location.trim();
    if (!q && !loc) return [];

    try {
        const results = await db.$queryRaw<JobSearchResult[]>(Prisma.sql`
            SELECT DISTINCT ON (j.id)
                j.id,
                j."jobTitle",
                c."companyName",
                c."companyImage",
                j.city,
                j.mode,
                j.salary,
                j.experience,
                j."isEasyApply",
                GREATEST(
                    ${q ? Prisma.sql`similarity(j."jobTitle", ${q})` : Prisma.sql`0`},
                    ${q ? Prisma.sql`similarity(c."companyName", ${q})` : Prisma.sql`0`},
                    ${q ? Prisma.sql`similarity(array_to_string(j.skills, ' '), ${q})` : Prisma.sql`0`}
                ) AS score
            FROM "Job" j
            INNER JOIN "Company" c ON j."companyId" = c.id
            WHERE
                j.status = 'ACTIVE'
                ${q ? Prisma.sql`AND (
                    j."jobTitle"         ILIKE ${'%' + q + '%'}
                    OR c."companyName"   ILIKE ${'%' + q + '%'}
                    OR j."jobDesc"       ILIKE ${'%' + q + '%'}
                    OR array_to_string(j.skills, ' ') ILIKE ${'%' + q + '%'}
                    OR similarity(j."jobTitle", ${q})    > 0.15
                    OR similarity(c."companyName", ${q}) > 0.15
                    OR similarity(array_to_string(j.skills, ' '), ${q}) > 0.15
                )` : Prisma.empty}
                ${loc ? Prisma.sql`AND (
                    j.city  ILIKE ${'%' + loc + '%'}
                    OR j.state ILIKE ${'%' + loc + '%'}
                    OR similarity(j.city, ${loc}) > 0.2
                )` : Prisma.empty}
            ORDER BY j.id, score DESC
            LIMIT ${limit}
        `);

        return results.sort((a: any, b: any) => b.score - a.score);
    } catch (error) {
        console.error("[SEARCH_JOBS]", error);
        return [];
    }
}

export async function searchJobIds(query: string, location = ""): Promise<number[]> {
    const results = await searchJobs(query, location, 100);
    return results.map((r) => r.id);
}

export async function searchJobSuggestions(query: string, location = ""): Promise<JobSuggestion[]> {
    const q = query.trim();
    const loc = location.trim();
    if (q.length < 2 && !loc) return [];

    try {
        const results = await db.$queryRaw<JobSuggestion[]>(Prisma.sql`
            SELECT DISTINCT ON (j."jobTitle")
                j.id,
                j."jobTitle",
                c."companyName",
                c."companyImage",
                j.city
            FROM "Job" j
            INNER JOIN "Company" c ON j."companyId" = c.id
            WHERE
                j.status = 'ACTIVE'
                ${q ? Prisma.sql`AND (
                    j."jobTitle"       ILIKE ${'%' + q + '%'}
                    OR c."companyName" ILIKE ${'%' + q + '%'}
                    OR similarity(j."jobTitle", ${q}) > 0.2
                )` : Prisma.empty}
                ${loc ? Prisma.sql`AND (
                    j.city ILIKE ${'%' + loc + '%'}
                    OR similarity(j.city, ${loc}) > 0.2
                )` : Prisma.empty}
            ORDER BY j."jobTitle", ${q ? Prisma.sql`similarity(j."jobTitle", ${q}) DESC` : Prisma.sql`j."jobTitle" ASC`}
            LIMIT 8
        `);
        return results;
    } catch (error) {
        console.error("[SEARCH_SUGGESTIONS]", error);
        return [];
    }
}