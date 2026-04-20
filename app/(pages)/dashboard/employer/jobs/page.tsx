import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import JobsClient from "./JobsClient";

export default async function RecruiterJobsPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect("/signin");
    }

    const userId = Number(session.user.id);

    const jobs = await db.job.findMany({
        where: { userId },
        include: {
            company: true,
            _count: {
                select: {
                    jobApplications: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return <JobsClient jobs={jobs} />;
}