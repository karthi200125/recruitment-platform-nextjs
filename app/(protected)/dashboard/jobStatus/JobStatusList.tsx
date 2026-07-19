"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Briefcase, ChevronRight } from "lucide-react";

import { CandidateApplication } from "@/types/candidate-application";
import { getStatusConfig } from "@/lib/dashboard/application-status";
import { CompanyAvatar } from "./Companyavatar";

interface JobStatusListProps {
    jobs: CandidateApplication[];
}

export default function JobStatusList({ jobs }: JobStatusListProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const activeJobId = searchParams.get("jobId");

    if (jobs.length === 0) {
        return (
            <div className="flex h-64 flex-col items-center justify-center gap-3 px-6 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100">
                    <Briefcase className="h-5 w-5 text-slate-400" strokeWidth={1.75} />
                </div>
                <p className="text-sm font-medium text-slate-500">No applications yet</p>
                <p className="text-xs text-slate-400">Start applying to jobs and track them here.</p>
            </div>
        );
    }

    return (
        <div className="divide-y divide-slate-100">
            {jobs.map((item, index) => {
                const isActive = activeJobId === String(item.jobId) || (!activeJobId && index === 0);
                const config = getStatusConfig(item.status);
                const StatusIcon = config.icon;

                return (
                    <button
                        type="button"
                        key={item.id}
                        onClick={() => router.push(`/dashboard/jobStatus?jobId=${item.jobId}`)}
                        className={`relative flex w-full items-start gap-3 border-l-[3px] p-4 text-left transition-all duration-200 ${isActive ? "border-indigo-500 bg-indigo-50" : "border-transparent hover:bg-slate-50"
                            }`}
                    >
                        <CompanyAvatar name={item.job.company.companyName} image={item.job.company.companyImage} />

                        <div className="min-w-0 flex-1">
                            <p className={`truncate text-sm font-semibold leading-snug ${isActive ? "text-indigo-900" : "text-slate-800"}`}>
                                {item.job.jobTitle}
                            </p>
                            <p className="mt-0.5 truncate text-xs text-slate-400">{item.job.company.companyName}</p>
                            <span
                                className={`mt-2 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${config.bg} ${config.text} ${config.border}`}
                            >
                                <StatusIcon className="h-3 w-3" strokeWidth={2} />
                                {config.label}
                            </span>
                        </div>

                        <ChevronRight
                            className={`mt-1 h-4 w-4 flex-shrink-0 transition-colors ${isActive ? "text-indigo-400" : "text-slate-300"}`}
                        />
                    </button>
                );
            })}
        </div>
    );
}