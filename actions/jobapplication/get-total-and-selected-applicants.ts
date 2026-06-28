"use server";

import { db } from "@/lib/db";

interface GetApplicantsResult {
    success: true;
    data: {
        totalApplicants: number;
        selectedApplicants: number;
    };
}

interface GetApplicantsError {
    error: string;
}

export async function getTotalAndSelectedApplicants(
    jobId: number
): Promise<GetApplicantsResult | GetApplicantsError> {
    try {
        const [
            totalApplicants,
            selectedApplicants,
        ] = await Promise.all([
            db.jobApplication.count({
                where: {
                    jobId,
                },
            }),

            db.jobApplication.count({
                where: {
                    jobId,
                    isSelected: true,
                },
            }),
        ]);

        return {
            success: true,
            data: {
                totalApplicants,
                selectedApplicants,
            },
        };
    } catch (error) {
        console.error(
            "[GET_TOTAL_SELECTED_APPLICANTS]",
            error
        );

        return {
            error:
                "Failed to retrieve applicants.",
        };
    }
}