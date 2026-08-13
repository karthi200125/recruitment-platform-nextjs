import {
    ApplicationStatus,
    Prisma,
    PrismaClient,
} from "@prisma/client";

const TOTAL_APPLICATIONS = 450;

const DEMO_RESUME =
    "https://example.com/resumes/jobify-demo-resume.pdf";

const APPLICATION_QUESTIONS = [
    {
        question:
            "Why are you interested in this position?",
        answers: [
            "I am interested in this role because it matches my technical experience and gives me an opportunity to work on meaningful products.",
            "This position aligns closely with my skills and career goals, and I would like to contribute to a strong engineering team.",
            "I am excited about the opportunity to solve real-world problems while continuing to grow technically.",
        ],
    },
    {
        question:
            "How soon can you join?",
        answers: [
            "Immediately",
            "Within 15 days",
            "Within 30 days",
            "Within 60 days",
        ],
    },
];

function randomItem<T>(items: T[]): T {
    return items[
        Math.floor(Math.random() * items.length)
    ];
}

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

function addMinutes(
    date: Date,
    minutes: number
) {
    return new Date(
        date.getTime() +
            minutes * 60 * 1000
    );
}

function addHours(
    date: Date,
    hours: number
) {
    return new Date(
        date.getTime() +
            hours * 60 * 60 * 1000
    );
}

function addDays(
    date: Date,
    days: number
) {
    return new Date(
        date.getTime() +
            days *
                24 *
                60 *
                60 *
                1000
    );
}

/*
|--------------------------------------------------------------------------
| Build realistic status distribution
|--------------------------------------------------------------------------
|
| Most applications should still be in early stages.
|
| APPLIED              ~25%
| VIEWED               ~15%
| UNDER_REVIEW        ~20%
| SHORTLISTED         ~12%
| INTERVIEW_SCHEDULED ~10%
| INTERVIEWED          ~7%
| HIRED                ~3%
| REJECTED             ~7%
| WITHDRAWN            ~1%
|
*/

function getApplicationStatus(
    index: number
): ApplicationStatus {
    const value = index % 100;

    if (value < 25) {
        return ApplicationStatus.APPLIED;
    }

    if (value < 40) {
        return ApplicationStatus.VIEWED;
    }

    if (value < 60) {
        return ApplicationStatus.UNDER_REVIEW;
    }

    if (value < 72) {
        return ApplicationStatus.SHORTLISTED;
    }

    if (value < 82) {
        return ApplicationStatus.INTERVIEW_SCHEDULED;
    }

    if (value < 89) {
        return ApplicationStatus.INTERVIEWED;
    }

    if (value < 92) {
        return ApplicationStatus.HIRED;
    }

    if (value < 99) {
        return ApplicationStatus.REJECTED;
    }

    return ApplicationStatus.WITHDRAWN;
}

function buildQuestionAnswers() {
    return APPLICATION_QUESTIONS.map(
        (item) => ({
            question: item.question,
            answer: randomItem(
                item.answers
            ),
        })
    );
}

function buildTimeline(
    appliedAt: Date,
    status: ApplicationStatus
) {
    const history: {
        status: ApplicationStatus;
        createdAt: Date;
    }[] = [
        {
            status:
                ApplicationStatus.APPLIED,
            createdAt: appliedAt,
        },
    ];

    let currentTime = appliedAt;

    const addStatus = (
        nextStatus: ApplicationStatus,
        hours: number
    ) => {
        currentTime = addHours(
            currentTime,
            hours
        );

        history.push({
            status: nextStatus,
            createdAt: currentTime,
        });
    };

    switch (status) {
        case ApplicationStatus.APPLIED:
            break;

        case ApplicationStatus.VIEWED:
            addStatus(
                ApplicationStatus.VIEWED,
                8
            );
            break;

        case ApplicationStatus.UNDER_REVIEW:
            addStatus(
                ApplicationStatus.VIEWED,
                8
            );
            addStatus(
                ApplicationStatus.UNDER_REVIEW,
                24
            );
            break;

        case ApplicationStatus.SHORTLISTED:
            addStatus(
                ApplicationStatus.VIEWED,
                8
            );
            addStatus(
                ApplicationStatus.UNDER_REVIEW,
                24
            );
            addStatus(
                ApplicationStatus.SHORTLISTED,
                48
            );
            break;

        case ApplicationStatus.INTERVIEW_SCHEDULED:
            addStatus(
                ApplicationStatus.VIEWED,
                8
            );
            addStatus(
                ApplicationStatus.UNDER_REVIEW,
                24
            );
            addStatus(
                ApplicationStatus.SHORTLISTED,
                48
            );
            addStatus(
                ApplicationStatus.INTERVIEW_SCHEDULED,
                72
            );
            break;

        case ApplicationStatus.INTERVIEWED:
            addStatus(
                ApplicationStatus.VIEWED,
                8
            );
            addStatus(
                ApplicationStatus.UNDER_REVIEW,
                24
            );
            addStatus(
                ApplicationStatus.SHORTLISTED,
                48
            );
            addStatus(
                ApplicationStatus.INTERVIEW_SCHEDULED,
                72
            );
            addStatus(
                ApplicationStatus.INTERVIEWED,
                48
            );
            break;

        case ApplicationStatus.HIRED:
            addStatus(
                ApplicationStatus.VIEWED,
                8
            );
            addStatus(
                ApplicationStatus.UNDER_REVIEW,
                24
            );
            addStatus(
                ApplicationStatus.SHORTLISTED,
                48
            );
            addStatus(
                ApplicationStatus.INTERVIEW_SCHEDULED,
                72
            );
            addStatus(
                ApplicationStatus.INTERVIEWED,
                48
            );
            addStatus(
                ApplicationStatus.HIRED,
                72
            );
            break;

        case ApplicationStatus.REJECTED:
            addStatus(
                ApplicationStatus.VIEWED,
                8
            );
            addStatus(
                ApplicationStatus.UNDER_REVIEW,
                24
            );
            addStatus(
                ApplicationStatus.REJECTED,
                48
            );
            break;

        case ApplicationStatus.WITHDRAWN:
            addStatus(
                ApplicationStatus.WITHDRAWN,
                48
            );
            break;
    }

    return history;
}

function getStatusDates(
    timeline: {
        status: ApplicationStatus;
        createdAt: Date;
    }[]
) {
    const find = (
        status: ApplicationStatus
    ) =>
        timeline.find(
            (item) =>
                item.status === status
        )?.createdAt ?? null;

    return {
        viewedAt: find(
            ApplicationStatus.VIEWED
        ),

        shortlistedAt: find(
            ApplicationStatus.SHORTLISTED
        ),

        interviewScheduledAt: find(
            ApplicationStatus.INTERVIEW_SCHEDULED
        ),

        interviewedAt: find(
            ApplicationStatus.INTERVIEWED
        ),

        hiredAt: find(
            ApplicationStatus.HIRED
        ),

        rejectedAt: find(
            ApplicationStatus.REJECTED
        ),

        withdrawnAt: find(
            ApplicationStatus.WITHDRAWN
        ),
    };
}

export async function seedApplications(
    prisma: PrismaClient
) {
    console.log(
        "📨 Seeding job applications..."
    );

    /*
     * DEV SEED ONLY
     *
     * Application history belongs to applications,
     * so delete history first.
     */
    await prisma.applicationStatusHistory.deleteMany();

    await prisma.jobApplication.deleteMany();

    /*
     * Get candidates only.
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
            "No candidate users found."
        );
    }

    /*
     * Get all jobs.
     */
    const jobs =
        await prisma.job.findMany({
            orderBy: {
                id: "asc",
            },
            include: {
                company: true,
            },
        });

    if (jobs.length === 0) {
        throw new Error(
            "No jobs found. Seed jobs before applications."
        );
    }

    /*
     * We need to make sure we never create
     * the same candidate/job combination twice.
     */
    const usedApplications =
        new Set<string>();

    let createdApplications = 0;

    /*
     * Application distribution counters.
     */
    const statusCounts: Record<
        ApplicationStatus,
        number
    > = {
        APPLIED: 0,
        VIEWED: 0,
        UNDER_REVIEW: 0,
        SHORTLISTED: 0,
        INTERVIEW_SCHEDULED: 0,
        INTERVIEWED: 0,
        HIRED: 0,
        REJECTED: 0,
        WITHDRAWN: 0,
    };

    let attempt = 0;

    while (
        createdApplications <
            TOTAL_APPLICATIONS &&
        attempt < 10000
    ) {
        attempt++;

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

        const key = `${candidate.id}-${job.id}`;

        /*
         * Prisma has @@unique([userId, jobId])
         */
        if (
            usedApplications.has(key)
        ) {
            continue;
        }

        usedApplications.add(key);

        /*
         * Make applications mostly recent,
         * but allow older applications too.
         */
        const appliedAt =
            randomPastDate(2, 120);

        const status =
            getApplicationStatus(
                createdApplications
            );

        /*
         * Prevent impossible future timeline dates.
         *
         * If the generated timeline would go beyond now,
         * keep the application as APPLIED.
         */
        let timeline =
            buildTimeline(
                appliedAt,
                status
            );

        const lastTimelineItem =
            timeline[
                timeline.length - 1
            ];

        if (
            lastTimelineItem.createdAt >
            new Date()
        ) {
            timeline = [
                {
                    status:
                        ApplicationStatus.APPLIED,
                    createdAt: appliedAt,
                },
            ];
        }

        const finalStatus =
            timeline[
                timeline.length - 1
            ].status;

        const statusDates =
            getStatusDates(
                timeline
            );

        /*
         * Create application.
         */
        const application =
            await prisma.jobApplication.create(
                {
                    data: {
                        userId:
                            candidate.id,

                        jobId: job.id,

                        candidateEmail:
                            candidate.email,

                        candidateMobile:
                            candidate.phoneNo ??
                            "+91 90000 00000",

                        candidateResume:
                            candidate.resume ??
                            DEMO_RESUME,

                        candidateResumePublicId:
                            candidate.resumePublicId ??
                            null,

                        questionAndAnswers:
                            job.questions
                                ? buildQuestionAnswers()
                                : Prisma.JsonNull,

                        status: finalStatus,

                        appliedAt,

                        viewedAt:
                            statusDates.viewedAt,

                        shortlistedAt:
                            statusDates.shortlistedAt,

                        interviewScheduledAt:
                            statusDates.interviewScheduledAt,

                        interviewedAt:
                            statusDates.interviewedAt,

                        hiredAt:
                            statusDates.hiredAt,

                        rejectedAt:
                            statusDates.rejectedAt,

                        withdrawnAt:
                            statusDates.withdrawnAt,
                    },
                }
            );

        /*
         * Create the complete status history.
         */
        await prisma.applicationStatusHistory.createMany(
            {
                data: timeline.map(
                    (item) => ({
                        applicationId:
                            application.id,

                        status:
                            item.status,

                        createdAt:
                            item.createdAt,
                    })
                ),
            }
        );

        createdApplications++;

        statusCounts[finalStatus]++;

        if (
            createdApplications %
                25 ===
            0
        ) {
            console.log(
                `   ✅ ${createdApplications}/${TOTAL_APPLICATIONS} applications`
            );
        }
    }

    console.log(
        `\n   🎉 Total applications: ${createdApplications}`
    );

    console.log(
        "\n   📊 Application status distribution:"
    );

    Object.entries(
        statusCounts
    ).forEach(
        ([status, count]) => {
            console.log(
                `      ${status}: ${count}`
            );
        }
    );
}