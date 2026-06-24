'use server'

import { db } from "@/lib/db";

export const updateJobApplicationStatus = async (jobAppId: number) => {
    
    try {
        
        await db.jobApplication.update({
            where: {
                id: jobAppId,
            },
            data: {
                isApplicationViewed: true,
                ApplicationViewedUpdatedAt: new Date(),
            },
        });

        return { success: true };
    } catch (error) {
        console.error("Error updating job application status:", error);
        return { error: "Failed to update job application status" };
    }
};
