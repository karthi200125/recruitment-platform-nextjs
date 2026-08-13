import {
    CompanyEmployeeRole,
    CompanyEmployeeStatus,
    PrismaClient,
} from "@prisma/client";

const TOTAL_EMPLOYEES = 50;

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

function randomItem<T>(items: T[]): T {
    return items[
        Math.floor(
            Math.random() * items.length
        )
    ];
}

export async function seedCompanyEmployees(
    prisma: PrismaClient
) {
    console.log(
        "👥 Seeding company employees..."
    );

    /*
     * DEV SEED ONLY
     *
     * Recreate company memberships every time.
     */
    await prisma.companyEmployee.deleteMany();

    /*
     * Get companies.
     */
    const companies =
        await prisma.company.findMany({
            orderBy: {
                id: "asc",
            },
        });

    if (companies.length === 0) {
        throw new Error(
            "No companies found. Seed companies first."
        );
    }

    /*
     * Recruiters and organizations are the
     * appropriate users for company memberships.
     */
    const companyUsers =
        await prisma.user.findMany({
            where: {
                role: {
                    in: [
                        "RECRUITER",
                        "ORGANIZATION",
                    ],
                },
            },
            orderBy: {
                id: "asc",
            },
        });

    if (companyUsers.length === 0) {
        throw new Error(
            "No recruiter/organization users found. Seed users first."
        );
    }

    /*
     * Candidates should not become company employees.
     */
    const usedMemberships =
        new Set<string>();

    let created = 0;

    /*
     * First create one OWNER for every company.
     *
     * The company.userId is the company owner
     * according to your schema.
     */
    for (const company of companies) {
        const owner = companyUsers.find(
            (user) =>
                user.id === company.userId
        );

        if (!owner) {
            console.warn(
                `⚠️ Owner user ${company.userId} not found for ${company.companyName}`
            );

            continue;
        }

        const key =
            `${company.id}-${owner.id}`;

        usedMemberships.add(key);

        await prisma.companyEmployee.create({
            data: {
                companyId: company.id,

                userId: owner.id,

                invitedById: null,

                role:
                    CompanyEmployeeRole.OWNER,

                status:
                    CompanyEmployeeStatus.ACCEPTED,

                joinedAt:
                    randomPastDate(
                        60,
                        500
                    ),
            },
        });

        created++;
    }

    /*
     * Create additional employees.
     *
     * Distribution:
     *
     * ADMIN      → 15%
     * HR         → 20%
     * RECRUITER  → 65%
     */
    while (
        created < TOTAL_EMPLOYEES &&
        usedMemberships.size <
            companies.length *
                companyUsers.length
    ) {
        const company =
            randomItem(companies);

        const employee =
            randomItem(companyUsers);

        /*
         * Don't add company owner again.
         */
        if (
            employee.id ===
            company.userId
        ) {
            continue;
        }

        const key =
            `${company.id}-${employee.id}`;

        /*
         * Prisma also enforces:
         *
         * @@unique([companyId, userId])
         */
        if (
            usedMemberships.has(key)
        ) {
            continue;
        }

        usedMemberships.add(key);

        const roleRandom =
            Math.random();

        let role:
            CompanyEmployeeRole;

        if (roleRandom < 0.15) {
            role =
                CompanyEmployeeRole.ADMIN;
        } else if (
            roleRandom < 0.35
        ) {
            role =
                CompanyEmployeeRole.HR;
        } else {
            role =
                CompanyEmployeeRole.RECRUITER;
        }

        /*
         * Most employees should be accepted.
         * A few can still be pending/left/rejected
         * to make the dashboard data realistic.
         */
        const statusRandom =
            Math.random();

        let status:
            CompanyEmployeeStatus;

        if (statusRandom < 0.82) {
            status =
                CompanyEmployeeStatus.ACCEPTED;
        } else if (
            statusRandom < 0.92
        ) {
            status =
                CompanyEmployeeStatus.PENDING;
        } else if (
            statusRandom < 0.97
        ) {
            status =
                CompanyEmployeeStatus.LEFT;
        } else {
            status =
                CompanyEmployeeStatus.REJECTED;
        }

        /*
         * A pending/rejected membership may not
         * have joined yet.
         */
        const joinedAt =
            status ===
                CompanyEmployeeStatus.ACCEPTED ||
            status ===
                CompanyEmployeeStatus.LEFT
                ? randomPastDate(
                      15,
                      400
                  )
                : null;

        /*
         * Use the company owner as inviter.
         */
        const invitedById =
            company.userId;

        await prisma.companyEmployee.create({
            data: {
                companyId:
                    company.id,

                userId:
                    employee.id,

                invitedById,

                role,

                status,

                joinedAt,
            },
        });

        created++;

        if (created % 10 === 0) {
            console.log(
                `   ✅ ${created}/${TOTAL_EMPLOYEES} company memberships`
            );
        }
    }

    /*
     * Print summary.
     */
    const summary =
        await prisma.companyEmployee.groupBy(
            {
                by: [
                    "role",
                    "status",
                ],
                _count: {
                    _all: true,
                },
            }
        );

    console.log(
        `\n   🎉 Total company memberships: ${created}`
    );

    console.log(
        "\n   📊 Company employee distribution:"
    );

    for (const item of summary) {
        console.log(
            `      ${item.role} / ${item.status}: ${item._count._all}`
        );
    }
}