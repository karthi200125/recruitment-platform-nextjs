"use client";

import Image from "next/image";

import { useRouter } from "next/navigation";

import {
    Plus,
    Users,
    LayoutDashboard,
    ListChecks,
    Bookmark,
    Briefcase,
    Eye,
} from "lucide-react";

import { Prisma, Role } from "@prisma/client";

// import AppliedCounts from "@/components/dashboard/cards/AppliedCounts";

import DashboardJobsTable from "@/components/dashboard/tables/DashboardJobsTable";

import CandidateOverview from "@/components/dashboard/overview/CandidateOverview";

import RecruiterOverview from "@/components/dashboard/overview/RecruiterOverview";

import OrganizationOverview from "@/components/dashboard/overview/OrganizationOverview";

import {
    candidateAppliedColumns,
    candidateSavedColumns,
} from "@/components/dashboard/tables/columns/candidate-columns";

import {
    recruiterPostedColumns,
} from "@/components/dashboard/tables/columns/recruiter-columns";
import AppliedCounts from "./AppliedCounts";
import { OrganizationPostedColumns } from "@/components/dashboard/tables/columns/organization-columns";

// import {
//     organizationPostedColumns,
// } from "@/components/dashboard/tables/columns/organization-columns";

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

type CandidateApplication =
    Prisma.JobApplicationGetPayload<{
        include: {
            job: {
                include: {
                    company: true;
                };
            };

            statusHistory: true;
        };
    }>;

type SavedJobType =
    Prisma.SavedJobGetPayload<{
        include: {
            job: {
                include: {
                    company: true;
                };
            };
        };
    }>;

type RecruiterPostedJob =
    Prisma.JobGetPayload<{
        include: {
            company: true;

            jobApplications: {
                select: {
                    id: true;
                };
            };
        };
    }>;

// ─────────────────────────────────────────────
// Dashboard Data Types
// ─────────────────────────────────────────────

type CandidateDashboardData = {
    applications: CandidateApplication[];

    savedJobs: SavedJobType[];

    analytics: {
        applicationTrend: unknown[];
        interviewTrend: unknown[];
    };

    counts: {
        applied: number;
        saved: number;
        interviews: number;
        profileViews: number;
    };
};

type RecruiterDashboardData = {
    postedJobs: RecruiterPostedJob[];

    analytics: {
        hiringTrend: unknown[];
        applicantsTrend: unknown[];
    };

    counts: {
        postedJobs: number;
        applicants: number;
        shortlisted: number;
        interviews: number;
    };
};

type OrganizationDashboardData = {
    company: {
        id: number;
        companyName: string;
    } | null;

    postedJobs: RecruiterPostedJob[];

    analytics: {
        companyHiringTrend: unknown[];
        recruitersPerformance: unknown[];
    };

    counts: {
        jobs: number;
        recruiters: number;
        employees: number;
        applicants: number;
    };
};

type TabType =
    | "overview"
    | "applied"
    | "saved"
    | "posted"
    | "profileViews";

interface DashboardClientProps {
    user: any;

    role: Role;

    candidateDashboardData?: CandidateDashboardData | null;

    recruiterDashboardData?: RecruiterDashboardData | null;

    organizationDashboardData?: OrganizationDashboardData | null;

    searchParams?: Record<
        string,
        string | string[] | undefined
    >;
}

// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────

const TAB_ICONS = {
    overview: LayoutDashboard,
    applied: ListChecks,
    saved: Bookmark,
    posted: Briefcase,
    profileViews: Eye,
};

const TAB_LABELS = {
    overview: "Overview",
    applied: "Applied Jobs",
    saved: "Saved Jobs",
    posted: "Posted Jobs",
    profileViews: "Profile Views",
};

const ROLE_LABELS = {
    CANDIDATE: "Job Seeker",
    RECRUITER: "Recruiter",
    ORGANIZATION: "Organization",
};

const ROLE_TABS = {
    CANDIDATE: [
        "overview",
        "applied",
        "saved",
        "profileViews",
    ],

    RECRUITER: [
        "overview",
        "posted",
        "profileViews",
    ],

    ORGANIZATION: [
        "overview",
        "posted",
        "profileViews",
    ],
} as const;

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

const DashboardClient = ({
    user,
    role,
    candidateDashboardData,
    recruiterDashboardData,
    organizationDashboardData,
    searchParams,
}: DashboardClientProps) => {
    const router = useRouter();

    // ─────────────────────────────────────────
    // Roles
    // ─────────────────────────────────────────

    const isCandidate =
        role === "CANDIDATE";

    const isRecruiter =
        role === "RECRUITER";

    const isOrganization =
        role === "ORGANIZATION";

    const canPost =
        isRecruiter || isOrganization;

    // ─────────────────────────────────────────
    // Tabs
    // ─────────────────────────────────────────

    const allowedTabs =
        ROLE_TABS[role] ??
        ROLE_TABS.CANDIDATE;

    const rawTab = searchParams?.tab as
        | TabType
        | undefined;

    const activeTab: TabType =
        rawTab &&
            allowedTabs.includes(rawTab)
            ? rawTab
            : "overview";

    // ─────────────────────────────────────────
    // Candidate Data
    // ─────────────────────────────────────────

    const applications =
        candidateDashboardData?.applications ??
        [];

    const savedJobs =
        candidateDashboardData?.savedJobs ??
        [];

    const candidateCounts =
        candidateDashboardData?.counts ?? {
            applied: 0,
            saved: 0,
            interviews: 0,
            profileViews: 0,
        };

    // ─────────────────────────────────────────
    // Recruiter Data
    // ─────────────────────────────────────────

    const recruiterPostedJobs =
        recruiterDashboardData?.postedJobs ??
        [];

    const recruiterCounts =
        recruiterDashboardData?.counts ?? {
            postedJobs: 0,
            applicants: 0,
            shortlisted: 0,
            interviews: 0,
        };

    // ─────────────────────────────────────────
    // Organization Data
    // ─────────────────────────────────────────

    const organizationPostedJobs =
        organizationDashboardData?.postedJobs ??
        [];

    const organizationCounts =
        organizationDashboardData?.counts ?? {
            jobs: 0,
            recruiters: 0,
            employees: 0,
            applicants: 0,
        };

    // ─────────────────────────────────────────
    // Render
    // ─────────────────────────────────────────

    return (
        <div className="min-h-screen w-full">
            <div className="space-y-7 py-8">
                {/* Header */}
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    {/* Left */}
                    <div className="flex items-center gap-3">
                        {/* Avatar */}
                        <div className="relative h-11 w-11 flex-shrink-0 overflow-hidden rounded-full border-2 border-white bg-indigo-100 shadow-sm">
                            {user.userImage ? (
                                <Image
                                    src={user.userImage}
                                    alt={user.username}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-indigo-600">
                                    {user.username
                                        ?.slice(0, 2)
                                        .toUpperCase()}
                                </span>
                            )}
                        </div>

                        {/* Title */}
                        <div>
                            <h1 className="text-lg font-bold capitalize leading-tight text-slate-900">
                                {TAB_LABELS[activeTab]}
                            </h1>

                            <p className="text-xs text-slate-400">
                                {user.username} ·{" "}
                                {ROLE_LABELS[role]}
                            </p>
                        </div>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-2">
                        {/* Organization */}
                        {isOrganization && (
                            <button
                                onClick={() =>
                                    router.push(
                                        "/dashboard/employees"
                                    )
                                }
                                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50"
                            >
                                <Users
                                    className="h-4 w-4"
                                    strokeWidth={1.75}
                                />

                                Employees
                            </button>
                        )}

                        {/* Post Job */}
                        {canPost && (
                            <button
                                onClick={() =>
                                    router.push("/createJob")
                                }
                                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-indigo-200 transition-colors duration-200 hover:bg-indigo-500"
                            >
                                <Plus
                                    className="h-4 w-4"
                                    strokeWidth={2.5}
                                />

                                Post a Job
                            </button>
                        )}
                    </div>
                </div>

                {/* Analytics Cards */}
                <AppliedCounts
                    role={role}
                    candidateCounts={
                        candidateCounts
                    }
                    recruiterCounts={
                        recruiterCounts
                    }
                    organizationCounts={
                        organizationCounts
                    }
                />

                {/* Tabs */}
                <div className="-mb-px flex h-15 items-center gap-1 overflow-x-auto border-b border-slate-200 pb-0">
                    {allowedTabs.map((tab) => {
                        const Icon = TAB_ICONS[tab];

                        const isActive =
                            activeTab === tab;

                        return (
                            <button
                                key={tab}
                                onClick={() =>
                                    router.push(
                                        `/dashboard?tab=${tab}`
                                    )
                                }
                                className={`-mb-px inline-flex items-center gap-1.5 whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${isActive
                                    ? "border-indigo-600 text-indigo-600"
                                    : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700"
                                    }`}
                            >
                                <Icon
                                    className="h-3.5 w-3.5"
                                    strokeWidth={
                                        isActive ? 2.5 : 1.75
                                    }
                                />

                                {TAB_LABELS[tab]}
                            </button>
                        );
                    })}
                </div>

                {/* Content */}
                <div>
                    {/* Overview */}
                    {activeTab === "overview" && (
                        <>
                            {/* Candidate */}
                            {isCandidate && (
                                <CandidateOverview
                                    applications={
                                        applications
                                    }
                                    savedJobs={savedJobs}
                                    counts={candidateCounts}
                                />
                            )}

                            {/* Recruiter */}
                            {isRecruiter && (
                                <RecruiterOverview
                                    postedJobs={
                                        recruiterPostedJobs
                                    }
                                    counts={recruiterCounts}
                                />
                            )}

                            {/* Organization */}
                            {isOrganization && (
                                <OrganizationOverview
                                    postedJobs={
                                        organizationPostedJobs
                                    }
                                    counts={
                                        organizationCounts
                                    }
                                />
                            )}
                        </>
                    )}

                    {/* Applied */}
                    {activeTab === "applied" &&
                        isCandidate && (
                            <DashboardJobsTable
                                columns={
                                    candidateAppliedColumns
                                }
                                data={applications}
                                emptyTitle="No applied jobs yet"
                                emptyDescription="Start applying to jobs to track your applications here."
                            />
                        )}

                    {/* Saved */}
                    {activeTab === "saved" &&
                        isCandidate && (
                            <DashboardJobsTable
                                columns={
                                    candidateSavedColumns
                                }
                                data={savedJobs}
                                emptyTitle="No saved jobs"
                                emptyDescription="Save jobs to keep track of opportunities."
                            />
                        )}

                    {/* Posted */}
                    {activeTab === "posted" &&
                        isRecruiter && (
                            <DashboardJobsTable
                                columns={
                                    recruiterPostedColumns
                                }
                                data={
                                    recruiterPostedJobs
                                }
                                emptyTitle="No jobs posted"
                                emptyDescription="Post jobs to start receiving applications."
                            />
                        )}

                    {/* Organization Posted */}
                    {activeTab === "posted" &&
                        isOrganization && (
                            <DashboardJobsTable
                                columns={
                                    OrganizationPostedColumns
                                }
                                data={
                                    organizationPostedJobs
                                }
                                emptyTitle="No company jobs"
                                emptyDescription="Start posting jobs for your organization."
                            />
                        )}

                    {/* Profile Views */}
                    {activeTab ===
                        "profileViews" && (
                            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
                                <h2 className="text-lg font-semibold text-slate-900">
                                    Profile Views
                                </h2>

                                <p className="mt-2 text-sm text-slate-500">
                                    Profile analytics will be
                                    available soon.
                                </p>
                            </div>
                        )}
                </div>
            </div>
        </div>
    );
};

export default DashboardClient;