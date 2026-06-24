'use server'

import { db } from "@/lib/db";

export const getTotalAndSelectedApplicants = async (jobId?: any) => {
    try {

        let SelectedApplicants: any;
        let TotalApplicants: any;

        TotalApplicants = await db.jobApplication.findMany({
            where: {
                jobId
            }
        })

        SelectedApplicants = await db.jobApplication.findMany({
            where: {
                jobId,
                isSelected: true
            }
        })

        return { success: true, data: { SelectedApplicants, TotalApplicants } };
    } catch (error) {
        console.error(error);
        return { error: "Failed to retrieve candidate's applied jobs." };
    }
};
