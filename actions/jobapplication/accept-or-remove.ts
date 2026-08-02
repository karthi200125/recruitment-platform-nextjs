"use server";

import { db } from "@/lib/db";
import { ApplicationStatus } from "@prisma/client";

export const AcceptOrRemove = async (
    jobApplicationId: number,
    action: "accept" | "remove"
) => {
    try {
        if (!jobApplicationId) {
            return {
                error: "Invalid job application.",
            };
        }

        if (action === "accept") {
            await db.jobApplication.update({
                where: {
                    id: jobApplicationId,
                },
                data: {
                    status: ApplicationStatus.SHORTLISTED,
                    shortlistedAt: new Date(),
                },
            });

            return {
                success: "Candidate shortlisted successfully.",
            };
        }

        await db.jobApplication.update({
            where: {
                id: jobApplicationId,
            },
            data: {
                status: ApplicationStatus.REJECTED,
                rejectedAt: new Date(),
            },
        });

        return {
            success: "Candidate rejected successfully.",
        };
    } catch (error) {
        console.error("[ACCEPT_OR_REMOVE]", error);

        return {
            error: "Failed to update candidate.",
        };
    }
};