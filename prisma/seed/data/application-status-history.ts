import {
    ApplicationStatus,
    PrismaClient,
} from "@prisma/client";

export async function seedApplicationStatusHistory(
    prisma: PrismaClient
) {
    console.log(
        "📊 Seeding application status history..."
    );

    /*
     * DEV SEED ONLY
     *
     * Remove existing history and rebuild it
     * from the application timestamps.
     */
    await prisma.applicationStatusHistory.deleteMany();

    const applications =
        await prisma.jobApplication.findMany({
            select: {
                id: true,
                status: true,

                appliedAt: true,
                viewedAt: true,
                shortlistedAt: true,
                interviewScheduledAt: true,
                interviewedAt: true,
                hiredAt: true,
                rejectedAt: true,
                withdrawnAt: true,
            },
            orderBy: {
                id: "asc",
            },
        });

    if (applications.length === 0) {
        throw new Error(
            "No applications found. Seed applications first."
        );
    }

    let created = 0;

    for (const application of applications) {
        const history: {
            applicationId: number;
            status: ApplicationStatus;
            createdAt: Date;
        }[] = [];

        /*
         * Every application starts with APPLIED.
         */
        history.push({
            applicationId: application.id,
            status: ApplicationStatus.APPLIED,
            createdAt: application.appliedAt,
        });

        /*
         * Profile/application viewed.
         */
        if (application.viewedAt) {
            history.push({
                applicationId: application.id,
                status: ApplicationStatus.VIEWED,
                createdAt: application.viewedAt,
            });
        }

        /*
         * Recruiter started reviewing the application.
         *
         * Your application model does not have a separate
         * underReviewAt timestamp, so we don't invent one here.
         *
         * If the final status is UNDER_REVIEW and there is no
         * later timestamp, we use viewedAt/appliedAt as the
         * closest available point.
         */
        if (
            application.status ===
            ApplicationStatus.UNDER_REVIEW
        ) {
            const reviewDate =
                application.viewedAt
                    ? new Date(
                          application.viewedAt.getTime() +
                              24 *
                                  60 *
                                  60 *
                                  1000
                      )
                    : application.appliedAt;

            if (
                reviewDate <= new Date()
            ) {
                history.push({
                    applicationId:
                        application.id,
                    status:
                        ApplicationStatus.UNDER_REVIEW,
                    createdAt: reviewDate,
                });
            }
        }

        /*
         * Shortlisted.
         */
        if (application.shortlistedAt) {
            history.push({
                applicationId: application.id,
                status:
                    ApplicationStatus.SHORTLISTED,
                createdAt:
                    application.shortlistedAt,
            });
        }

        /*
         * Interview scheduled.
         */
        if (
            application.interviewScheduledAt
        ) {
            history.push({
                applicationId:
                    application.id,
                status:
                    ApplicationStatus.INTERVIEW_SCHEDULED,
                createdAt:
                    application.interviewScheduledAt,
            });
        }

        /*
         * Interview completed.
         */
        if (application.interviewedAt) {
            history.push({
                applicationId:
                    application.id,
                status:
                    ApplicationStatus.INTERVIEWED,
                createdAt:
                    application.interviewedAt,
            });
        }

        /*
         * Hired.
         */
        if (application.hiredAt) {
            history.push({
                applicationId:
                    application.id,
                status:
                    ApplicationStatus.HIRED,
                createdAt:
                    application.hiredAt,
            });
        }

        /*
         * Rejected.
         */
        if (application.rejectedAt) {
            history.push({
                applicationId:
                    application.id,
                status:
                    ApplicationStatus.REJECTED,
                createdAt:
                    application.rejectedAt,
            });
        }

        /*
         * Withdrawn.
         */
        if (application.withdrawnAt) {
            history.push({
                applicationId:
                    application.id,
                status:
                    ApplicationStatus.WITHDRAWN,
                createdAt:
                    application.withdrawnAt,
            });
        }

        /*
         * Sort chronologically.
         *
         * This is important because your UI can then
         * display the application timeline correctly.
         */
        history.sort(
            (a, b) =>
                a.createdAt.getTime() -
                b.createdAt.getTime()
        );

        /*
         * Remove accidental duplicate statuses.
         *
         * For example, if APPLIED and another generated
         * timestamp happen to point to the same stage.
         */
        const uniqueHistory: typeof history =
            [];

        const seenStatuses =
            new Set<ApplicationStatus>();

        for (const item of history) {
            if (
                seenStatuses.has(
                    item.status
                )
            ) {
                continue;
            }

            seenStatuses.add(item.status);

            uniqueHistory.push(item);
        }

        if (uniqueHistory.length > 0) {
            await prisma.applicationStatusHistory.createMany(
                {
                    data: uniqueHistory,
                }
            );

            created +=
                uniqueHistory.length;
        }

        if (
            created % 100 ===
            0
        ) {
            console.log(
                `   ✅ ${created} history records`
            );
        }
    }

    console.log(
        `   🎉 Total status history records: ${created}`
    );
}