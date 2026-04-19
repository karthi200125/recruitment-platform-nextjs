import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/authOptions";

import { getUserById } from "@/actions/auth/getUserById";
import { getAppliedJobs } from "@/actions/jobapplication/getAppliedJobs";
import { getSavedJobs } from "@/actions/job/getSavedJobs";
import { getActionTakenJobs } from "@/actions/job/getActionTakensJobs";

import DashboardClient from "./DashboardClient";

import { Prisma } from "@prisma/client";

// ✅ Types from Prisma
type JobWithCompany = Prisma.JobGetPayload<{
    include: { company: true };
}>;

type UserWithRelations = Prisma.UserGetPayload<{
    include: { postedJobs: true };
}>;

export const metadata: Metadata = {
    title: "Dashboard | Job Portal",
    description: "Manage your jobs, applications, and profile",
    robots: {
        index: false,
        follow: false,
    },
};

interface DashboardPageProps {
    searchParams?: Record<string, string | string[] | undefined>;
}

const DashboardPage = async ({ searchParams }: DashboardPageProps) => {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        redirect("/login");
    }

    const userId = Number(session.user.id);

    const [
        user,
        appliedJobsRes,
        savedJobsRes,
        actionTakenJobsRes,
    ] = await Promise.all([
        getUserById(userId),
        getAppliedJobs(userId),
        getSavedJobs(userId),
        getActionTakenJobs(userId),
    ]);

    // ✅ Extract data correctly
    const appliedJobs: JobWithCompany[] = appliedJobsRes?.data ?? [];
    const savedJobs: JobWithCompany[] = savedJobsRes?.data ?? [];
    const actionTakenJobs: JobWithCompany[] =
        actionTakenJobsRes?.data ?? [];

    return (
        <DashboardClient
            user={user as UserWithRelations}
            appliedJobs={appliedJobs}
            savedJobs={savedJobs}
            actionTakenJobs={actionTakenJobs}
            searchParams={searchParams}
        />
    );
};

export default DashboardPage;