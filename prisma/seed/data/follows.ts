import { PrismaClient } from "@prisma/client";

const TOTAL_FOLLOWS = 500;

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

function randomItem<T>(
    items: T[]
): T {
    return items[
        Math.floor(
            Math.random() *
            items.length
        )
    ];
}

export async function seedFollows(
    prisma: PrismaClient
) {
    console.log(
        "🤝 Seeding follow relationships..."
    );

    /*
     * DEV SEED ONLY
     *
     * Recreate all follow relationships.
     */
    await prisma.follow.deleteMany();

    /*
     * Get all users.
     */
    const users =
        await prisma.user.findMany({
            select: {
                id: true,
                role: true,
            },
            orderBy: {
                id: "asc",
            },
        });

    if (users.length < 2) {
        throw new Error(
            "At least two users are required to create follows."
        );
    }

    /*
     * Separate users by role.
     *
     * This lets us create relationships that
     * make sense for a job platform.
     */
    const candidates =
        users.filter(
            (user) =>
                user.role ===
                "CANDIDATE"
        );

    const recruiters =
        users.filter(
            (user) =>
                user.role ===
                "RECRUITER"
        );

    const organizations =
        users.filter(
            (user) =>
                user.role ===
                "ORGANIZATION"
        );

    /*
     * Prevent duplicate relationships.
     *
     * Your schema has:
     *
     * @@unique([followerId, followingId])
     */
    const usedRelations =
        new Set<string>();

    let created = 0;

    let candidateToRecruiter = 0;
    let candidateToOrganization = 0;
    let recruiterToCandidate = 0;
    let recruiterToRecruiter = 0;
    let organizationToCandidate = 0;
    let otherRelations = 0;

    let attempts = 0;

    while (
        created < TOTAL_FOLLOWS &&
        attempts < 30000
    ) {
        attempts++;

        let follower;
        let following;

        /*
         * Generate realistic relationship types.
         *
         * 40% Candidate → Recruiter
         * 20% Candidate → Organization
         * 15% Recruiter → Candidate
         * 10% Recruiter → Recruiter
         * 10% Organization → Candidate
         * 5%  Other
         */
        const type =
            Math.random();

        if (
            type < 0.40 &&
            candidates.length &&
            recruiters.length
        ) {
            follower =
                randomItem(candidates);

            following =
                randomItem(recruiters);

            candidateToRecruiter++;
        } else if (
            type < 0.60 &&
            candidates.length &&
            organizations.length
        ) {
            follower =
                randomItem(candidates);

            following =
                randomItem(
                    organizations
                );

            candidateToOrganization++;
        } else if (
            type < 0.75 &&
            recruiters.length &&
            candidates.length
        ) {
            follower =
                randomItem(recruiters);

            following =
                randomItem(candidates);

            recruiterToCandidate++;
        } else if (
            type < 0.85 &&
            recruiters.length > 1
        ) {
            follower =
                randomItem(recruiters);

            following =
                randomItem(recruiters);

            recruiterToRecruiter++;
        } else if (
            type < 0.95 &&
            organizations.length &&
            candidates.length
        ) {
            follower =
                randomItem(
                    organizations
                );

            following =
                randomItem(candidates);

            organizationToCandidate++;
        } else {
            /*
             * General user-to-user relationship.
             */
            follower =
                randomItem(users);

            following =
                randomItem(users);

            otherRelations++;
        }

        /*
         * Safety check.
         */
        if (
            !follower ||
            !following
        ) {
            continue;
        }

        /*
         * Users cannot follow themselves.
         */
        if (
            follower.id ===
            following.id
        ) {
            continue;
        }

        const key =
            `${follower.id}-${following.id}`;

        /*
         * Prevent duplicate follow.
         */
        if (
            usedRelations.has(key)
        ) {
            continue;
        }

        usedRelations.add(key);

        await prisma.follow.create({
            data: {
                followerId:
                    follower.id,

                followingId:
                    following.id,

                createdAt:
                    randomPastDate(
                        1,
                        180
                    ),
            },
        });

        created++;

        if (
            created % 50 ===
            0
        ) {
            console.log(
                `   ✅ ${created}/${TOTAL_FOLLOWS} follows`
            );
        }
    }

    console.log(
        `\n   🎉 Total follows: ${created}`
    );

    console.log(
        "\n   📊 Follow relationship distribution:"
    );

    console.log(
        `      Candidate → Recruiter: ${candidateToRecruiter}`
    );

    console.log(
        `      Candidate → Organization: ${candidateToOrganization}`
    );

    console.log(
        `      Recruiter → Candidate: ${recruiterToCandidate}`
    );

    console.log(
        `      Recruiter → Recruiter: ${recruiterToRecruiter}`
    );

    console.log(
        `      Organization → Candidate: ${organizationToCandidate}`
    );

    console.log(
        `      Other: ${otherRelations}`
    );
}