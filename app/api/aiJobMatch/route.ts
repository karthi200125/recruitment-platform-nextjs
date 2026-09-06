import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/authentication/authOptions";
import { db } from "@/lib/db";

import { getAIUserProfile } from "@/actions/ai/jobs/get-ai-user-profile";
import { getJobAIMatches } from "@/actions/ai/jobs/get-job-ai-matches";

export const dynamic = "force-dynamic";

const MAX_JOBS_PER_REQUEST = 10;

export async function POST(req: NextRequest) {
    try {
        // ─────────────────────────────────────────────────────────────
        // 1. Authenticate the request
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
        // 2. Read request body
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

        const rawJobIds = (body as { jobIds?: unknown }).jobIds;

        if (!Array.isArray(rawJobIds)) {
            return NextResponse.json(
                { error: "jobIds must be an array" },
                { status: 400 }
            );
        }

        // ─────────────────────────────────────────────────────────────
        // 3. Validate + deduplicate job IDs
        // ─────────────────────────────────────────────────────────────

        const jobIds = [
            ...new Set(
                rawJobIds
                    .map(Number)
                    .filter(
                        (id) =>
                            Number.isInteger(id) &&
                            id > 0
                    )
            ),
        ].slice(0, MAX_JOBS_PER_REQUEST);

        if (jobIds.length === 0) {
            return NextResponse.json([]);
        }

        console.log("🤖 AI MATCH REQUEST:", {
            userId,
            jobIds,
        });

        // ─────────────────────────────────────────────────────────────
        // 4. Get user's AI profile
        // ─────────────────────────────────────────────────────────────

        const userProfile = await getAIUserProfile(userId);

        // ─────────────────────────────────────────────────────────────
        // 5. Get the requested ACTIVE jobs
        // ─────────────────────────────────────────────────────────────

        const jobs = await db.job.findMany({
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
        });

        if (jobs.length === 0) {
            return NextResponse.json([]);
        }

        // ─────────────────────────────────────────────────────────────
        // 6. Call the MAIN AI matching function
        // ─────────────────────────────────────────────────────────────
        //
        // This is where Gemini is actually used.
        //
        // route.ts does NOT contain the AI matching logic.
        //
        // getJobAIMatches()
        //        ↓
        //      Gemini
        //        ↓
        //   match results
        //

        const aiMatches = await getJobAIMatches(
            userProfile,
            jobs
        );

        console.log("🤖 AI MATCH RESULTS:", aiMatches);

        // ─────────────────────────────────────────────────────────────
        // 7. Return AI results to JobsClient
        // ─────────────────────────────────────────────────────────────

        return NextResponse.json(aiMatches, {
            status: 200,

            headers: {
                "Cache-Control":
                    "private, max-age=300",
            },
        });
    } catch (error) {
        // ─────────────────────────────────────────────────────────────
        // 8. Never crash the jobs UI because AI failed
        // ─────────────────────────────────────────────────────────────

        console.error(
            "❌ AI JOB MATCH ROUTE ERROR:",
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