"use client";

import { useRouter } from "next/navigation";
import { GoPlus } from "react-icons/go";
import { IoIosPeople } from "react-icons/io";

import { Prisma } from "@prisma/client";

import Button from "@/components/Button";
import AppliedCounts from "./AppliedCounts";
import ShowAll from "./ShowAll";
import ShowJobs from "./ShowJobs";

// TYPES
type UserWithRelations = Prisma.UserGetPayload<{
    include: {
        postedJobs: {
            include: {
                company: true;
            };
        };
    };
}>;

type JobWithCompany = Prisma.JobGetPayload<{
    include: {
        company: true;
    };
}>;

type TabType =
    | "overview"
    | "applied"
    | "saved"
    | "posted"
    | "profileViews";

interface DashboardClientProps {
    user: UserWithRelations;
    appliedJobs: JobWithCompany[];
    savedJobs: JobWithCompany[];
    actionTakenJobs: JobWithCompany[];
    searchParams?: Record<string, string | string[] | undefined>;
}

const DashboardClient = ({
    user,
    appliedJobs,
    savedJobs,
    actionTakenJobs,
    searchParams,
}: DashboardClientProps) => {
    const router = useRouter();

    // ✅ CLEAN TAB SYSTEM
    const tab = searchParams?.tab as TabType;
    const activeTab = tab || "overview";

    const isRecruiter = user.role === "RECRUITER";
    const isCandidate = user.role === "CANDIDATE";
    const isORG = user.role === "ORGANIZATION";

    // ✅ Tabs config (role-based)
    const tabs = [
        { label: "Overview", value: "overview" },
        ...(isCandidate || isRecruiter
            ? [{ label: "Applied", value: "applied" }]
            : []),
        ...(isCandidate || isRecruiter
            ? [{ label: "Saved", value: "saved" }]
            : []),
        ...(isRecruiter || isORG
            ? [{ label: "Posted", value: "posted" }]
            : []),
        { label: "Profile Views", value: "profileViews" },
    ];

    return (
        <div className="w-full min-h-screen pt-5 space-y-6 px-2">
            {/* ================= HEADER ================= */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-5">
                <h2 className="capitalize text-xl font-semibold">
                    {activeTab}
                </h2>

                <div className="flex gap-3">
                    {isORG && (
                        <Button
                            variant="border"
                            onClick={() => router.push("/dashboard/employees")}
                            icon={<IoIosPeople size={20} />}
                        >
                            Employees
                        </Button>
                    )}

                    {(isRecruiter || isORG) && (
                        <Button
                            variant="border"
                            onClick={() => router.push("/createJob")}
                            icon={<GoPlus size={20} />}
                        >
                            Create Job
                        </Button>
                    )}
                </div>
            </div>

            {/* ================= STATS ================= */}
            <AppliedCounts appliedJobs={appliedJobs} user={user} />

            {/* ================= TABS ================= */}
            <div className="flex gap-3 border-b pb-2 overflow-x-auto">
                {tabs.map((t) => (
                    <button
                        key={t.value}
                        onClick={() => router.push(`/dashboard?tab=${t.value}`)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition ${activeTab === t.value
                                ? "bg-black text-white"
                                : "text-neutral-500 hover:bg-neutral-100"
                            }`}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            {/* ================= CONTENT ================= */}

            {/* OVERVIEW */}
            {activeTab === "overview" && (
                <div className="space-y-6">
                    {(isCandidate || isRecruiter) && (
                        <ShowJobs
                            Jobs={appliedJobs}
                            title="Applied Jobs"
                            href="/dashboard?tab=applied"
                            type="applied"
                        />
                    )}

                    {(isRecruiter || isORG) && (
                        <ShowJobs
                            Jobs={user.postedJobs ?? []}
                            title="Posted Jobs"
                            href="/dashboard?tab=posted"
                            type="posted"
                        />
                    )}

                    {(isCandidate || isRecruiter) && (
                        <ShowJobs
                            Jobs={savedJobs}
                            title="Saved Jobs"
                            href="/dashboard?tab=saved"
                        />
                    )}
                </div>
            )}

            {/* APPLIED */}
            {activeTab === "applied" && (
                <ShowAll
                    user={user}
                    type="appliedJobs"
                    appliedJobs={appliedJobs}
                />
            )}

            {/* SAVED */}
            {activeTab === "saved" && (
                <ShowAll
                    user={user}
                    type="savedJobs"
                    savedJobs={savedJobs}
                />
            )}

            {/* POSTED */}
            {activeTab === "posted" && (
                <ShowAll
                    user={user}
                    type="postedJobs"
                    postedJobs={user.postedJobs ?? []}
                />
            )}

            {/* PROFILE VIEWS */}
            {activeTab === "profileViews" && (
                <ShowAll user={user} type="profileViews" />
            )}
        </div>
    );
};

export default DashboardClient;