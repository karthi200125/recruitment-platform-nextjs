import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/db";
import { FEATURES } from "@/types/features";
import CreateJobClient from "./CreateJobClient";

export default async function CreateJobPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) redirect("/signin");

    const user = await db.user.findUnique({ where: { id: session.user.id } });

    if (!user) redirect("/signin");
    if (user.role === "CANDIDATE") redirect("/dashboard");

    const tier = user.isPro ? "PRO" : "FREE";
    const features = FEATURES[user.role][tier];

    const activeJobs = await db.job.count({
        where: { userId: user.id, status: "ACTIVE" },
    });

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const monthlyJobs = await db.job.count({
        where: { userId: user.id, createdAt: { gte: startOfMonth } },
    });

    const isBlocked =
        activeJobs >= features.MAX_ACTIVE_JOBS ||
        ("JOBS_PER_MONTH" in features && monthlyJobs >= features.JOBS_PER_MONTH);

    return (
        <CreateJobClient
            userId={user.id}
            role={user.role as "RECRUITER" | "ORGANIZATION"}
            features={features}
            usage={{ activeJobs, monthlyJobs }}
            isBlocked={isBlocked}
        />
    );
}