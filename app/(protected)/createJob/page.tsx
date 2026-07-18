import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { db } from "@/lib/db";
import { FEATURES } from "@/types/features";
import CreateJobClient from "./CreateJobClient";
import { getCurrentUserCompany } from "@/actions/company/get-current-user-company.ts";

export default async function CreateJobPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        redirect("/signin");
    }

    const userId = Number(session.user.id);
    const user = await db.user.findUnique({
        where: {
            id: userId,
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

    const company = await getCurrentUserCompany(userId);

    if (!company) {
        redirect("/dashboard");
    }

    const tier = user.isPro ? "PRO" : "FREE";
    const features = FEATURES[user.role][tier];
    const startOfMonth = new Date();

    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const [
        activeJobs,
        monthlyJobs,
    ] = await Promise.all([
        db.job.count({
            where: {
                userId,
                status: "ACTIVE",
            },
        }),

        db.job.count({
            where: {
                userId,
                createdAt: {
                    gte: startOfMonth,
                },
            },
        }),
    ]);

    const isBlocked = activeJobs >= features.MAX_ACTIVE_JOBS ||
        ("JOBS_PER_MONTH" in features &&
            monthlyJobs >=
            features.JOBS_PER_MONTH);

    return (
        <CreateJobClient
            userId={userId}
            role={user.role}
            recruiterCompany={company}
            features={features}
            usage={{
                activeJobs,
                monthlyJobs,
            }}
            isBlocked={isBlocked}
        />
    );
}