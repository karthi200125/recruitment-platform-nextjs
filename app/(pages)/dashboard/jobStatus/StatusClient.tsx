"use client";

import JobStatusList, { JobStatusListSkeleton } from "./JobStatusList";
import JobStatusDetails, { JobStatusDetailsSkeleton } from "./JobStatusDetails";

interface Company {
    companyName: string;
    companyImage?: string | null;
}

interface Job {
    jobTitle: string;
    mode?: string;
    company: Company;
}

interface Application {
    id: number;
    jobId: number;
    status: string;
    createdAt: Date | null;
    viewedAt?: Date | null;
    shortlistedAt?: Date | null;
    rejectedAt?: Date | null;
    job: Job;
}

interface Props {
    appliedJobs: Application[];
    selectedApplication: Application | null;
    isLoading?: boolean;
}

export default function StatusClient({ appliedJobs, selectedApplication, isLoading = false }: Props) {
    return (
        <div className="flex h-[calc(100vh-64px)] bg-white overflow-hidden rounded-2xl border border-slate-200 shadow-sm">

            {/* LEFT — list panel */}
            <div className="w-full md:w-[320px] lg:w-[360px] flex-shrink-0 flex flex-col border-r border-slate-100 overflow-hidden">

                {/* Panel header */}
                <div className="px-4 py-4 border-b border-slate-100 bg-white flex-shrink-0">
                    <h2 className="text-sm font-bold text-slate-800">My Applications</h2>
                    {!isLoading && (
                        <p className="text-xs text-slate-400 mt-0.5">{appliedJobs.length} total</p>
                    )}
                </div>

                {/* Scrollable list */}
                <div className="flex-1 overflow-y-auto">
                    {isLoading ? <JobStatusListSkeleton /> : <JobStatusList jobs={appliedJobs} />}
                </div>
            </div>

            {/* RIGHT — detail panel */}
            <div className="hidden md:flex flex-col flex-1 overflow-y-auto bg-slate-50/50">
                {isLoading ? (
                    <JobStatusDetailsSkeleton />
                ) : (
                    <JobStatusDetails application={selectedApplication} />
                )}
            </div>

        </div>
    );
}