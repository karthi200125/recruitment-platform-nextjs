"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Clock, Eye, Star, XCircle, Briefcase, ChevronRight } from "lucide-react";

interface Company {
    companyName: string;
    companyImage?: string | null;
}

interface Job {
    jobTitle: string;
    company: Company;
}

interface Application {
    id: number;
    jobId: number;
    status: string;
    job: Job;
}

export function getStatusConfig(status: string) {
    switch (status) {
        case "APPLIED":
            return { label: "Applied", bg: "bg-slate-100", text: "text-slate-600", border: "border-slate-200", icon: Clock };
        case "VIEWED":
            return { label: "Viewed", bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-200", icon: Eye };
        case "SHORTLISTED":
            return { label: "Shortlisted", bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-200", icon: Star };
        case "REJECTED":
            return { label: "Rejected", bg: "bg-red-50", text: "text-red-600", border: "border-red-200", icon: XCircle };
        default:
            return { label: status, bg: "bg-slate-100", text: "text-slate-500", border: "border-slate-200", icon: Clock };
    }
}

function CompanyAvatar({ name, image }: { name: string; image?: string | null }) {
    const initials = name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
    if (image) {
        return (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image} alt={name} className="w-10 h-10 rounded-xl object-cover border border-slate-200 flex-shrink-0" />
        );
    }
    return (
        <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600 flex-shrink-0">
            {initials}
        </div>
    );
}

export function JobStatusListSkeleton() {
    return (
        <div className="divide-y divide-slate-100">
            {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="p-4 animate-pulse">
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-200 flex-shrink-0" />
                        <div className="flex-1 space-y-2 pt-0.5">
                            <div className="h-3.5 w-3/4 rounded-lg bg-slate-200" />
                            <div className="h-3 w-1/2 rounded-lg bg-slate-100" />
                            <div className="h-5 w-20 rounded-full bg-slate-100 mt-1" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function JobStatusList({ jobs }: { jobs: Application[] }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const activeJobId = searchParams.get("jobId");

    if (!jobs.length) {
        return (
            <div className="flex flex-col items-center justify-center h-64 gap-3 px-6 text-center">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-slate-400" strokeWidth={1.75} />
                </div>
                <p className="text-sm text-slate-500 font-medium">No applications yet</p>
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
                    <div
                        key={item.id}
                        onClick={() => router.push(`/dashboard/jobStatus?jobId=${item.jobId}`)}
                        className={`relative flex items-start gap-3 p-4 cursor-pointer transition-all duration-200 ${isActive
                                ? "bg-indigo-50 border-l-[3px] border-indigo-500"
                                : "hover:bg-slate-50 border-l-[3px] border-transparent"
                            }`}
                    >
                        <CompanyAvatar name={item.job.company.companyName} image={item.job.company.companyImage} />

                        <div className="flex-1 min-w-0">
                            <p className={`text-sm font-semibold truncate leading-snug ${isActive ? "text-indigo-900" : "text-slate-800"}`}>
                                {item.job.jobTitle}
                            </p>
                            <p className="text-xs text-slate-400 mt-0.5 truncate">
                                {item.job.company.companyName}
                            </p>
                            <span className={`inline-flex items-center gap-1.5 mt-2 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${config.bg} ${config.text} ${config.border}`}>
                                <StatusIcon className="w-3 h-3" strokeWidth={2} />
                                {config.label}
                            </span>
                        </div>

                        <ChevronRight className={`w-4 h-4 flex-shrink-0 mt-1 transition-colors ${isActive ? "text-indigo-400" : "text-slate-300"}`} />
                    </div>
                );
            })}
        </div>
    );
}