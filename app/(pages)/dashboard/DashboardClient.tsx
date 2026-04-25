"use client";

import { useRouter } from "next/navigation";
import { Plus, Users, LayoutDashboard, ListChecks, Bookmark, Briefcase, Eye } from "lucide-react";
import { Prisma } from "@prisma/client";
import Image from "next/image";

import AppliedCounts from "./AppliedCounts";
import ShowAll from "./ShowAll";
import ShowJobs from "./ShowJobs";

type UserWithRelations = Prisma.UserGetPayload<{
    include: {
        postedJobs: {
            include: { company: true };
        };
    };
}>;

type JobWithCompany = Prisma.JobGetPayload<{
    include: { company: true };
}>;

type TabType = "overview" | "applied" | "saved" | "posted" | "profileViews";

interface DashboardClientProps {
    user: UserWithRelations;
    appliedJobs: JobWithCompany[];
    savedJobs: JobWithCompany[];
    actionTakenJobs: JobWithCompany[];
    searchParams?: Record<string, string | string[] | undefined>;
}

const TAB_ICONS: Record<TabType, React.ElementType> = {
    overview: LayoutDashboard,
    applied: ListChecks,
    saved: Bookmark,
    posted: Briefcase,
    profileViews: Eye,
};

const ROLE_LABELS: Record<string, string> = {
    CANDIDATE: "Job Seeker",
    RECRUITER: "Recruiter",
    ORGANIZATION: "Organization",
};

const DashboardClient = ({ user, appliedJobs, savedJobs, actionTakenJobs, searchParams }: DashboardClientProps) => {
    const router = useRouter();

    const tab = searchParams?.tab as TabType;
    const activeTab: TabType = tab || "overview";

    const isRecruiter = user.role === "RECRUITER";
    const isCandidate = user.role === "CANDIDATE";
    const isORG = user.role === "ORGANIZATION";

    const tabs: { label: string; value: TabType }[] = [
        { label: "Overview", value: "overview" },
        ...(isCandidate || isRecruiter ? [{ label: "Applied", value: "applied" as TabType }] : []),
        ...(isCandidate || isRecruiter ? [{ label: "Saved", value: "saved" as TabType }] : []),
        ...(isRecruiter || isORG ? [{ label: "Posted", value: "posted" as TabType }] : []),
        { label: "Profile Views", value: "profileViews" as TabType },
    ];

    const TAB_LABELS: Record<TabType, string> = {
        overview: "Overview",
        applied: "Applied Jobs",
        saved: "Saved Jobs",
        posted: "Posted Jobs",
        profileViews: "Profile Views",
    };

    return (
        <div className="w-full min-h-screen bg-slate-50/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-7">

                {/* ── Header ── */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        {/* Avatar */}
                        <div className="relative w-11 h-11 rounded-full border-2 border-white shadow-sm overflow-hidden bg-indigo-100 flex-shrink-0">
                            {user.userImage ? (
                                <Image src={user.userImage} alt={user.username} fill className="object-cover" />
                            ) : (
                                <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-indigo-600">
                                    {user.username?.slice(0, 2).toUpperCase()}
                                </span>
                            )}
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-slate-900 capitalize leading-tight">
                                {TAB_LABELS[activeTab]}
                            </h1>
                            <p className="text-xs text-slate-400">
                                {user.username} · {ROLE_LABELS[user.role ?? ""] ?? user.role}
                            </p>
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2">
                        {isORG && (
                            <button
                                onClick={() => router.push("/dashboard/employees")}
                                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200"
                            >
                                <Users className="w-4 h-4" strokeWidth={1.75} />
                                Employees
                            </button>
                        )}
                        {(isRecruiter || isORG) && (
                            <button
                                onClick={() => router.push("/createJob")}
                                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors duration-200 shadow-sm shadow-indigo-200"
                            >
                                <Plus className="w-4 h-4" strokeWidth={2.5} />
                                Post a Job
                            </button>
                        )}
                    </div>
                </div>

                {/* ── Stats cards ── */}
                <AppliedCounts appliedJobs={appliedJobs} user={user} />

                {/* ── Tab bar ── */}
                <div className="flex items-center gap-1 border-b border-slate-200 overflow-x-auto pb-0 -mb-px">
                    {tabs.map((t) => {
                        const Icon = TAB_ICONS[t.value];
                        const isActive = activeTab === t.value;
                        return (
                            <button
                                key={t.value}
                                onClick={() => router.push(`/dashboard?tab=${t.value}`)}
                                className={`inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold whitespace-nowrap border-b-2 transition-all duration-200 -mb-px ${
                                    isActive
                                        ? "border-indigo-600 text-indigo-600"
                                        : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                                }`}
                            >
                                <Icon className="w-3.5 h-3.5" strokeWidth={isActive ? 2.5 : 1.75} />
                                {t.label}
                            </button>
                        );
                    })}
                </div>

                {/* ── Tab content ── */}
                <div>

                    {/* OVERVIEW */}
                    {activeTab === "overview" && (
                        <div className="space-y-8">
                            {(isCandidate || isRecruiter) && (
                                <ShowJobs Jobs={appliedJobs} title="Applied Jobs" href="/dashboard?tab=applied" type="applied" />
                            )}
                            {(isRecruiter || isORG) && (
                                <ShowJobs Jobs={user.postedJobs ?? []} title="Posted Jobs" href="/dashboard?tab=posted" type="posted" />
                            )}
                            {(isCandidate || isRecruiter) && (
                                <ShowJobs Jobs={savedJobs} title="Saved Jobs" href="/dashboard?tab=saved" />
                            )}
                        </div>
                    )}

                    {activeTab === "applied" && (
                        <ShowAll user={user} type="appliedJobs" appliedJobs={appliedJobs} />
                    )}
                    {activeTab === "saved" && (
                        <ShowAll user={user} type="savedJobs" savedJobs={savedJobs} />
                    )}
                    {activeTab === "posted" && (
                        <ShowAll user={user} type="postedJobs" postedJobs={user.postedJobs ?? []} />
                    )}
                    {activeTab === "profileViews" && (
                        <ShowAll user={user} type="profileViews" />
                    )}
                </div>

            </div>
        </div>
    );
};

export default DashboardClient;