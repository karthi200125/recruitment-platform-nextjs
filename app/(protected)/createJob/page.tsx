import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { getUserCompany } from "@/actions/company/get-user-company";
import { authOptions } from "@/lib/auth/authOptions";
import { db } from "@/lib/db";
import { FEATURES } from "@/types/features";

import CreateJobClient from "./CreateJobClient";

export default async function CreateJobPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        redirect("/signin");
    }

    const user = await db.user.findUnique({
        where: {
            id: session.user.id,
        },
    });

    if (!user) {
        redirect("/signin");
    }

    if (
        user.role !== "RECRUITER" &&
        user.role !== "ORGANIZATION"
    ) {
        redirect("/dashboard");
    }


    const recruiterCompany = await getUserCompany(user.id);

    const tier = user.isPro ? "PRO" : "FREE";

    const features = FEATURES[user.role][tier];

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const [activeJobs, monthlyJobs] = await Promise.all([
        db.job.count({
            where: {
                userId: user.id,
                status: "ACTIVE",
            },
        }),

        db.job.count({
            where: {
                userId: user.id,
                createdAt: {
                    gte: startOfMonth,
                },
            },
        }),
    ]);

    const isBlocked =
        activeJobs >= features.MAX_ACTIVE_JOBS ||
        ("JOBS_PER_MONTH" in features &&
            monthlyJobs >= features.JOBS_PER_MONTH);

    return (
        <CreateJobClient
            userId={user.id}
            role={user.role}
            recruiterCompany={recruiterCompany}
            features={features}
            usage={{
                activeJobs,
                monthlyJobs,
            }}
            isBlocked={isBlocked}
        />
    );
}