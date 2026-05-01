import { db } from "@/lib/db";
import { cache } from "react";
import { Prisma } from "@prisma/client";

export type CompanyWithJobsCount = Prisma.CompanyGetPayload<{
    include: {
        jobs: { select: { id: true } };
    };
}>;

export const getCompanies = cache(
    async (): Promise<CompanyWithJobsCount[]> => {
        try {
            return await db.company.findMany({
                where: { companyIsVerified: true },
                include: {
                    jobs: { select: { id: true } },
                },
                orderBy: { createdAt: "desc" },
            });
        } catch (error) {
            console.error("[getCompanies]", error);
            return [];
        }
    }
);