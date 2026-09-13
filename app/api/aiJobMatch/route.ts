// FILE: app/api/aiJobMatch/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/authentication/authOptions";
import { db } from "@/lib/db";

import { getAIUserProfile } from "@/actions/ai/jobs/get-ai-user-profile";
import { getJobAIMatches } from "@/actions/ai/jobs/get-job-ai-matches";

export const dynamic = "force-dynamic";

const MAX_JOBS_PER_REQUEST = 10;
const CACHE_MAX_AGE = 300;

export async function POST(req: NextRequest) {
    try {
        // ─────────────────────────────────────────────────────────────
        // 1. Authenticate
        // ─────────────────────────────────────────────────────────────

        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const userId = Number(session.user.id);

        if (!Number.isInteger(userId) || userId <= 0) {
            return NextResponse.json(
                { error: "Invalid user" },
                { status: 401 }
            );
        }

        // ─────────────────────────────────────────────────────────────
        // 2. Parse request body
        // ─────────────────────────────────────────────────────────────

        const body: unknown = await req.json();

        if (
            !body ||
            typeof body !== "object" ||
            !("jobIds" in body)
        ) {
            return NextResponse.json(
                { error: "jobIds is required" },
                { status: 400 }
            );
        }

        const rawJobIds = (
            body as {
                jobIds?: unknown;
            }
        ).jobIds;

        if (!Array.isArray(rawJobIds)) {
            return NextResponse.json(
                { error: "jobIds must be an array" },
                { status: 400 }
            );
        }

        // ─────────────────────────────────────────────────────────────
        // 3. Validate + deduplicate job IDs
        // ─────────────────────────────────────────────────────────────

        const uniqueJobIds = new Set<number>();

        for (const value of rawJobIds) {
            const id = Number(value);

            if (
                Number.isInteger(id) &&
                id > 0
            ) {
                uniqueJobIds.add(id);

                if (
                    uniqueJobIds.size >=
                    MAX_JOBS_PER_REQUEST
                ) {
                    break;
                }
            }
        }

        const jobIds = Array.from(
            uniqueJobIds
        );

        if (jobIds.length === 0) {
            return NextResponse.json([]);
        }

        // ─────────────────────────────────────────────────────────────
        // 4. Fetch profile + jobs IN PARALLEL
        // ─────────────────────────────────────────────────────────────
        //
        // These two operations are independent.
        //
        // OLD:
        //
        // await getAIUserProfile()
        //        ↓
        // await db.job.findMany()
        //
        // NEW:
        //
        // ┌─ getAIUserProfile()
        // │
        // └─ db.job.findMany()
        //        ↓
        //   getJobAIMatches()
        //

        const [userProfile, jobs] = await Promise.all([
            getAIUserProfile(userId),

            db.job.findMany({
                where: {
                    id: {
                        in: jobIds,
                    },
                    status: "ACTIVE",
                },

                select: {
                    id: true,
                    jobTitle: true,
                    jobDesc: true,
                    experience: true,
                    city: true,
                    state: true,
                    country: true,
                    type: true,
                    mode: true,
                    skills: true,
                },
            }),
        ]);

        // ─────────────────────────────────────────────────────────────
        // 5. No active jobs
        // ─────────────────────────────────────────────────────────────

        if (jobs.length === 0) {
            return NextResponse.json([]);
        }

        // ─────────────────────────────────────────────────────────────
        // 6. Main AI matching function
        // ─────────────────────────────────────────────────────────────
        //
        // This remains server-side.
        //
        // route.ts
        //     ↓
        // getJobAIMatches()
        //     ↓
        // Gemini
        //

        const aiMatches = await getJobAIMatches(
            userProfile,
            jobs
        );

        // ─────────────────────────────────────────────────────────────
        // 7. Return results
        // ─────────────────────────────────────────────────────────────

        return NextResponse.json(
            aiMatches,
            {
                status: 200,
                headers: {
                    "Cache-Control":
                        `private, max-age=${CACHE_MAX_AGE}`,
                },
            }
        );
    } catch (error) {
        // ─────────────────────────────────────────────────────────────
        // 8. Graceful failure
        // ─────────────────────────────────────────────────────────────

        console.error(
            "AI JOB MATCH ROUTE ERROR:",
            error
        );

        return NextResponse.json(
            {
                error: "AI job matching failed",
            },
            {
                status: 500,
            }
        );
    }
}