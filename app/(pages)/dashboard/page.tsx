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

// ✅ Types
type JobWithCompany = Prisma.JobGetPayload<{
  include: { company: true };
}>;

type UserWithRelations = Prisma.UserGetPayload<{
  include: {
    postedJobs: {
      include: { company: true };
    };
    savedJobs: true;
  };
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
    redirect("/signin");
  }

  const userId = Number(session.user.id);

  if (!userId) {
    redirect("/signin");
  }

  const [
    userRes,
    appliedJobsRes,
    savedJobsRes,
    actionTakenJobsRes,
  ] = await Promise.all([
    getUserById(userId),
    getAppliedJobs(userId),
    getSavedJobs(userId),
    getActionTakenJobs(userId),
  ]);

  console.log("User Res:", userRes);

  // ✅ FIXED VALIDATION
  if (!userRes?.success || !userRes.data) {
    redirect("/signin");
  }

  // ✅ SAFE EXTRACTION
  const appliedJobs: JobWithCompany[] =
    appliedJobsRes?.success ? appliedJobsRes.data ?? [] : [];

  const savedJobs: JobWithCompany[] =
    savedJobsRes?.success ? savedJobsRes.data ?? [] : [];

  const actionTakenJobs: JobWithCompany[] =
    actionTakenJobsRes?.success ? actionTakenJobsRes.data ?? [] : [];

  return (
    <DashboardClient
      user={userRes.data}   // ✅ FIXED
      appliedJobs={appliedJobs}
      savedJobs={savedJobs}
      actionTakenJobs={actionTakenJobs}
      searchParams={searchParams}
    />
  );
};

export default DashboardPage;