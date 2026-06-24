'use server';

import { db } from "@/lib/db";

export const getCompanyJobs = async (id: any) => {
    try {
        const companyJobs: any = await db.company.findUnique({
            where: {
                id: id,
            },
            include: {
                jobs: true,
            },
        });

        return companyJobs;
    } catch (err) {
        console.error("Error fetching company jobs:", err);
        return { error: "Failed to fetch company jobs" };
    }
};
