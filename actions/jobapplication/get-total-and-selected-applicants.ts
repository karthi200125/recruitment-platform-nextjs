"use server";

import { ApplicationStatus } from "@prisma/client";

import { db } from "@/lib/db";

interface GetApplicantsResult {
    success: true;
    data: {
        totalApplicants: number;
        shortlistedApplicants: number;
    };
}

interface GetApplicantsError {
    success: false;
    error: string;
}

export async function getTotalAndSelectedApplicants(
    jobId: number
): Promise<GetApplicantsResult | GetApplicantsError> {
    try {
        const [totalApplicants, shortlistedApplicants] = await Promise.all([
            db.jobApplication.count({
                where: {
                    jobId,
                },
            }),

            db.jobApplication.count({
                where: {
                    jobId,
                    status: ApplicationStatus.SHORTLISTED,
                },
            }),
        ]);

        return {
            success: true,
            data: {
                totalApplicants,
                shortlistedApplicants,
            },
        };
    } catch (error) {
        console.error(
            "[GET_TOTAL_SELECTED_APPLICANTS]",
            error
        );

        return {
            success: false,
            error: "Failed to retrieve applicants.",
        };
    }
}