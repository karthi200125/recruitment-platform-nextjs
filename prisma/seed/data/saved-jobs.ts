import { PrismaClient } from "@prisma/client";

const TOTAL_SAVED_JOBS = 280;

function randomPastDate(
    minDays: number,
    maxDays: number
) {
    const days =
        Math.floor(
            Math.random() *
                (maxDays - minDays + 1)
        ) + minDays;

    return new Date(
        Date.now() -
            days *
                24 *
                60 *
                60 *
                1000
    );
}

export async function seedSavedJobs(
    prisma: PrismaClient
) {
    console.log("🔖 Seeding saved jobs...");

    /*
     * DEV SEED ONLY
     *
     * We are still building the demo database,
     * so recreate saved jobs each time.
     */
    await prisma.savedJob.deleteMany();

    /*
     * Only candidates should normally save jobs.
     */
    const candidates =
        await prisma.user.findMany({
            where: {
                role: "CANDIDATE",
            },
            orderBy: {
                id: "asc",
            },
        });

    if (candidates.length === 0) {
        throw new Error(
            "No candidate users found. Seed users first."
        );
    }

    /*
     * Get active jobs.
     */
    const jobs =
        await prisma.job.findMany({
            where: {
                status: "ACTIVE",
            },
            orderBy: {
                id: "asc",
            },
        });

    if (jobs.length === 0) {
        throw new Error(
            "No active jobs found. Seed jobs first."
        );
    }

    /*
     * Prevent duplicate user/job combinations.
     *
     * Prisma also enforces:
     *
     * @@unique([userId, jobId])
     */
    const usedSavedJobs =
        new Set<string>();

    let created = 0;

    let attempts = 0;

    /*
     * Create a realistic number of saved jobs.
     */
    while (
        created < TOTAL_SAVED_JOBS &&
        attempts < 10000
    ) {
        attempts++;

        const candidate =
            candidates[
                Math.floor(
                    Math.random() *
                        candidates.length
                )
            ];

        const job =
            jobs[
                Math.floor(
                    Math.random() *
                        jobs.length
                )
            ];

        const key =
            `${candidate.id}-${job.id}`;

        /*
         * Don't save the same job twice
         * for the same candidate.
         */
        if (
            usedSavedJobs.has(key)
        ) {
            continue;
        }

        usedSavedJobs.add(key);

        await prisma.savedJob.create({
            data: {
                userId:
                    candidate.id,

                jobId:
                    job.id,

                createdAt:
                    randomPastDate(
                        1,
                        90
                    ),
            },
        });

        created++;

        if (created % 25 === 0) {
            console.log(
                `   ✅ ${created}/${TOTAL_SAVED_JOBS} saved jobs`
            );
        }
    }

    console.log(
        `\n   🎉 Total saved jobs: ${created}`
    );
}