import { PrismaClient } from "@prisma/client";

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

function addMonths(
    date: Date,
    months: number
) {
    const result = new Date(date);

    result.setMonth(
        result.getMonth() + months
    );

    return result;
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

export async function seedSubscriptions(
    prisma: PrismaClient
) {
    console.log(
        "💳 Seeding subscriptions..."
    );

    /*
     * Because Subscription.userId is unique,
     * every user can have only one subscription.
     */
    await prisma.subscription.deleteMany();

    /*
     * Reset existing Pro state first.
     */
    await prisma.user.updateMany({
        data: {
            isPro: false,
            stripeCustomerId: null,
        },
    });

    /*
     * Get users.
     */
    const users =
        await prisma.user.findMany({
            select: {
                id: true,
                role: true,
            },
        });

    /*
     * We don't want everyone to be Pro.
     *
     * Approximately:
     *
     * Candidates       → 20 Pro
     * Recruiters       → 10 Pro
     * Organizations    → 5 Pro
     *
     * Total             → around 35
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

    const selectedCandidates =
        [...candidates]
            .sort(
                () =>
                    Math.random() -
                    0.5
            )
            .slice(0, 20);

    const selectedRecruiters =
        [...recruiters]
            .sort(
                () =>
                    Math.random() -
                    0.5
            )
            .slice(0, 10);

    const selectedOrganizations =
        [...organizations]
            .sort(
                () =>
                    Math.random() -
                    0.5
            )
            .slice(0, 5);

    const selectedUsers = [
        ...selectedCandidates,
        ...selectedRecruiters,
        ...selectedOrganizations,
    ];

    let activeCount = 0;
    let canceledCount = 0;
    let totalAmount = 0;

    for (const user of selectedUsers) {
        /*
         * Different plans depending on role.
         */
        let planName: string;
        let amount: number;

        if (
            user.role ===
            "CANDIDATE"
        ) {
            planName =
                randomItem([
                    "CANDIDATE",
                    "CANDIDATE_PRO",
                ]);

            amount =
                planName ===
                "CANDIDATE_PRO"
                    ? 999
                    : 499;
        } else if (
            user.role ===
            "RECRUITER"
        ) {
            planName =
                randomItem([
                    "RECRUITER",
                    "RECRUITER_PRO",
                ]);

            amount =
                planName ===
                "RECRUITER_PRO"
                    ? 1999
                    : 999;
        } else {
            planName =
                randomItem([
                    "ORGANIZATION",
                    "ORGANIZATION_PRO",
                ]);

            amount =
                planName ===
                "ORGANIZATION_PRO"
                    ? 4999
                    : 2499;
        }

        /*
         * Monthly billing for seed data.
         */
        const billingInterval =
            "month";

        /*
         * Most subscriptions active.
         *
         * Around 85% active
         * Around 15% canceled
         */
        const isCanceled =
            Math.random() < 0.15;

        const createdAt =
            randomPastDate(
                10,
                180
            );

        const currentPeriodEnd =
            addMonths(
                new Date(),
                isCanceled
                    ? -1
                    : 1
            );

        const subscriptionStatus =
            isCanceled
                ? "canceled"
                : "active";

        /*
         * Fake Stripe IDs.
         *
         * IMPORTANT:
         * These are only seed/demo values.
         * They are NOT real Stripe objects.
         */
        const stripeCustomerId =
            `cus_seed_${user.id}_${Date.now()}`;

        const stripeSubscriptionId =
            `sub_seed_${user.id}_${Date.now()}`;

        const stripePriceId =
            `price_seed_${planName.toLowerCase()}`;

        await prisma.subscription.create({
            data: {
                userId: user.id,

                stripeSubscriptionId,

                stripePriceId,

                stripeCurrentPeriodEnd:
                    currentPeriodEnd,

                subscriptionStatus,

                planName,

                billingInterval,

                amount,

                cancelAtPeriodEnd:
                    isCanceled,

                canceledAt:
                    isCanceled
                        ? randomPastDate(
                              1,
                              30
                          )
                        : null,

                createdAt,
            },
        });

        /*
         * Keep User.isPro synchronized.
         *
         * Only active subscriptions
         * should have isPro = true.
         */
        await prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                isPro:
                    !isCanceled,

                stripeCustomerId,
            },
        });

        if (isCanceled) {
            canceledCount++;
        } else {
            activeCount++;
        }

        totalAmount += amount;
    }

    console.log(
        `   ✅ Total subscriptions: ${selectedUsers.length}`
    );

    console.log(
        `   🟢 Active: ${activeCount}`
    );

    console.log(
        `   🔴 Canceled: ${canceledCount}`
    );

    console.log(
        `   💰 Seeded monthly value: ₹${totalAmount.toLocaleString(
            "en-IN"
        )}`
    );

    console.log(
        `   👑 Pro users updated: ${activeCount}`
    );
}