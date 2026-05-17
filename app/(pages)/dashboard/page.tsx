import { Metadata } from "next";

import { redirect } from "next/navigation";

import { getServerSession } from "next-auth";

import { Prisma, Role } from "@prisma/client";

import { authOptions } from "@/lib/authOptions";

import { getUserById } from "@/actions/auth/getUserById";

import { getCandidateDashboardData } from "@/actions/dashboard/getCandidateDashboardData";

import { getRecruiterDashboardData } from "@/actions/dashboard/getRecruiterDashboardData";

import { getOrganizationDashboardData } from "@/actions/dashboard/getOrganizationDashboardData";

import DashboardClient from "./DashboardClient";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

type UserWithRelations = Prisma.UserGetPayload<{
  include: {
    postedJobs: {
      include: {
        company: true;
      };
    };
  };
}>;

// ─────────────────────────────────────────────
// Metadata
// ─────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Dashboard | Job Portal",

  description:
    "Manage your jobs, applications, and profile",

  robots: {
    index: false,
    follow: false,
  },
};

interface DashboardPageProps {
  searchParams?: Record<
    string,
    string | string[] | undefined
  >;
}

// ─────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────

const DashboardPage = async ({
  searchParams,
}: DashboardPageProps) => {
  // Session
  const session =
    await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/signin");
  }

  // User ID
  const userId = Number(session.user.id);

  if (!userId) {
    redirect("/signin");
  }


  const user = session.user 

  // Role
  const role = (user.role ??
    "CANDIDATE") as Role;

  // ─────────────────────────────────────────
  // Dashboard Data
  // ─────────────────────────────────────────

  let candidateDashboardData = null;

  let recruiterDashboardData = null;

  let organizationDashboardData =
    null;

  // ─────────────────────────────────────────
  // Candidate Dashboard
  // ─────────────────────────────────────────

  if (role === "CANDIDATE") {
    const dashboardRes =
      await getCandidateDashboardData(
        userId
      );

    if (
      dashboardRes.success &&
      dashboardRes.data
    ) {
      candidateDashboardData =
        dashboardRes.data;
    } else {
      candidateDashboardData = {
        applications: [],

        savedJobs: [],

        analytics: {
          applicationTrend: [],
          interviewTrend: [],
        },

        counts: {
          applied: 0,
          saved: 0,
          interviews: 0,
          profileViews: 0,
        },
      };
    }
  }

  // ─────────────────────────────────────────
  // Recruiter Dashboard
  // ─────────────────────────────────────────

  if (role === "RECRUITER") {
    const dashboardRes =
      await getRecruiterDashboardData(
        userId
      );

    if (
      dashboardRes.success &&
      dashboardRes.data
    ) {
      recruiterDashboardData =
        dashboardRes.data;
    } else {
      recruiterDashboardData = {
        postedJobs: [],

        analytics: {
          hiringTrend: [],
          applicantsTrend: [],
        },

        counts: {
          postedJobs: 0,
          applicants: 0,
          shortlisted: 0,
          interviews: 0,
        },
      };
    }
  }

  // ─────────────────────────────────────────
  // Organization Dashboard
  // ─────────────────────────────────────────

  if (role === "ORGANIZATION") {
    const dashboardRes =
      await getOrganizationDashboardData(
        userId
      );

    if (
      dashboardRes.success &&
      dashboardRes.data
    ) {
      organizationDashboardData =
        dashboardRes.data;
    } else {
      organizationDashboardData = {
        company: null,

        postedJobs: [],

        analytics: {
          companyHiringTrend: [],
          recruitersPerformance: [],
        },

        counts: {
          jobs: 0,
          recruiters: 0,
          employees: 0,
          applicants: 0,
        },
      };
    }
  }

  // ─────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────

  return (
    <DashboardClient
      user={user}
      role={role}
      candidateDashboardData={
        candidateDashboardData
      }
      recruiterDashboardData={
        recruiterDashboardData
      }
      organizationDashboardData={
        organizationDashboardData
      }
      searchParams={searchParams}
    />
  );
};

export default DashboardPage;