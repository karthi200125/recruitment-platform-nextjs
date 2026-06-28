'use server';

import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";

type GetCompanyJobsResult =
    | Prisma.CompanyGetPayload<{
        include: {
            jobs: {
                orderBy: {
                    createdAt: "desc";
                };
            };
        };
    }>
    | null
    | { error: string };

export const getCompanyJobs = async (
    id: number
): Promise<GetCompanyJobsResult> => {
    try {
        return await db.company.findUnique({
            where: {
                id,
            },
            include: {
                jobs: {
                    orderBy: {
                        createdAt: "desc",
                    },
                },
            },
        });
    } catch (error) {
        console.error("[GET_COMPANY_JOBS]", error);

        return {
            error: "Failed to fetch company jobs",
        };
    }
};