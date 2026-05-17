import { Prisma } from "@prisma/client";

export const dashboardJobInclude =
    Prisma.validator<Prisma.JobInclude>()({
        company: true,
    });

export const dashboardApplicationInclude =
    Prisma.validator<Prisma.JobApplicationInclude>()({
        job: {
            include: {
                company: true,
            },
        },
        statusHistory: {
            orderBy: {
                createdAt: "desc",
            },
            take: 1,
        },
    });