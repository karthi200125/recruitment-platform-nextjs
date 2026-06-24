'use server'

import { db } from "@/lib/db";
import { cache } from "react";

export type CompanyWithJobsCount = {
    id: number;
    companyName: string;
    companyImage: string | null;
    companyCity: string;
    companyCountry: string;
    jobsCount: number;
};

export const getCompanies = cache(
    async (): Promise<CompanyWithJobsCount[]> => {
        try {
            const companies = await db.company.findMany({
                where: { companyIsVerified: true },
                select: {
                    id: true,
                    companyName: true,
                    companyImage: true,
                    companyCity: true,
                    companyCountry: true,
                    _count: {
                        select: { jobs: true },
                    },
                },
                orderBy: { createdAt: "desc" },
            });

            return companies.map((c) => ({
                ...c,
                jobsCount: c._count.jobs,
            }));
        } catch (error) {
            console.error("[getCompanies]", error);
            return [];
        }
    }
);