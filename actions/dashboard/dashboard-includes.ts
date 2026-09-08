import { Prisma } from "@prisma/client";

export const dashboardJobInclude =
    Prisma.validator<Prisma.JobInclude>()({
        company: {
            select: {
                id: true,
                companyName: true,
                companyImage: true,
            },
        },
    });

export const dashboardApplicationInclude =
    Prisma.validator<Prisma.JobApplicationInclude>()({
        job: {
            select: {
                id: true,
                jobTitle: true,
                company: {
                    select: {
                        id: true,
                        companyName: true,
                        companyImage: true,
                    },
                },
            },
        },

        statusHistory: {
            orderBy: {
                createdAt: "desc",
            },
            take: 1,
            select: {
                id: true,
                status: true,
                createdAt: true,
            },
        },
    });