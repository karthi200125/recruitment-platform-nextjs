import { db } from "@/lib/db";
import { setApplicationStatus } from "./updateApplicationStatus";

export const markApplicationViewedIfNeeded = async (applicationId: number): Promise<void> => {
    const application = await db.jobApplication.findUnique({
        where: { id: applicationId },
        select: { status: true },
    });

    if (application?.status === "APPLIED") {
        await setApplicationStatus(applicationId, "VIEWED");
    }
};