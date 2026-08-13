import { PrismaClient } from "@prisma/client";

const TOTAL_PROFILE_VIEWS = 700;

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

export async function seedProfileViews(
    prisma: PrismaClient
) {
    console.log(
        "👀 Seeding profile views..."
    );

    /*
     * DEV SEED ONLY
     */
    await prisma.profileView.deleteMany();

    /*
     * All users can have their profiles viewed.
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

    if (users.length === 0) {
        throw new Error(
            "No users found. Seed users first."
        );
    }

    /*
     * Logged-in viewers.
     */
    const viewers =
        await prisma.user.findMany({
            select: {
                id: true,
            },
        });

    if (viewers.length === 0) {
        throw new Error(
            "No viewer users found."
        );
    }

    /*
     * Prevent duplicate:
     *
     * profileUserId + viewerUserId
     *
     * because your Prisma schema has:
     *
     * @@unique([profileUserId, viewerUserId])
     */
    const usedViews =
        new Set<string>();

    let created = 0;

    let anonymousViews = 0;
    let registeredViews = 0;

    let attempts = 0;

    while (
        created < TOTAL_PROFILE_VIEWS &&
        attempts < 20000
    ) {
        attempts++;

        /*
         * Random profile being viewed.
         */
        const profileUser =
            randomItem(users);

        /*
         * Around 15% of views are anonymous.
         */
        const isAnonymous =
            Math.random() < 0.15;

        let viewerUserId:
            | number
            | null;

        if (isAnonymous) {
            viewerUserId = null;
        } else {
            const viewer =
                randomItem(viewers);

            /*
             * A user should not view
             * their own profile.
             */
            if (
                viewer.id ===
                profileUser.id
            ) {
                continue;
            }

            viewerUserId =
                viewer.id;
        }

        /*
         * Anonymous views:
         *
         * Your schema has @@unique([profileUserId, viewerUserId]).
         *
         * PostgreSQL allows multiple NULL values in
         * a normal unique constraint, but we'll still
         * intentionally limit anonymous views per profile
         * so the generated data stays manageable.
         */

        const key =
            `${profileUser.id}-${viewerUserId ?? "anonymous"}-${created}`;

        /*
         * Registered viewers must have a unique
         * profile/viewer combination.
         */
        if (
            viewerUserId !== null
        ) {
            const uniqueKey =
                `${profileUser.id}-${viewerUserId}`;

            if (
                usedViews.has(
                    uniqueKey
                )
            ) {
                continue;
            }

            usedViews.add(
                uniqueKey
            );
        } else {
            /*
             * Anonymous views do not have a viewer ID.
             *
             * We use a unique seed key here so multiple
             * anonymous views can still be generated.
             */
            if (
                usedViews.has(key)
            ) {
                continue;
            }

            usedViews.add(key);
        }

        await prisma.profileView.create({
            data: {
                profileUserId:
                    profileUser.id,

                viewerUserId,

                createdAt:
                    randomPastDate(
                        1,
                        120
                    ),
            },
        });

        created++;

        if (
            viewerUserId === null
        ) {
            anonymousViews++;
        } else {
            registeredViews++;
        }

        if (
            created % 100 ===
            0
        ) {
            console.log(
                `   ✅ ${created}/${TOTAL_PROFILE_VIEWS} profile views`
            );
        }
    }

    console.log(
        `\n   🎉 Total profile views: ${created}`
    );

    console.log(
        `   👤 Registered viewers: ${registeredViews}`
    );

    console.log(
        `   🌐 Anonymous views: ${anonymousViews}`
    );
}