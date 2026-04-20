"use client";

import { CheckCircle2, Eye, Star, XCircle, Briefcase } from "lucide-react";
import { getStatusConfig } from "./JobStatusList";

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

function formatDate(date: Date | null | undefined): string {
    if (!date) return "Pending";
    return new Intl.DateTimeFormat("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    }).format(new Date(date));
}

function CompanyAvatar({ name, image }: { name: string; image?: string | null }) {
    const initials = name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
    if (image) {
        return (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image} alt={name} className="w-11 h-11 rounded-xl object-cover border border-slate-200 flex-shrink-0" />
        );
    }
    return (
        <div className="w-11 h-11 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-sm font-bold text-indigo-600 flex-shrink-0">
            {initials}
        </div>
    );
}

const MODE_STYLES: Record<string, string> = {
    remote: "bg-emerald-50 text-emerald-600 border-emerald-200",
    hybrid: "bg-violet-50 text-violet-600 border-violet-200",
    onsite: "bg-amber-50 text-amber-600 border-amber-200",
};

export function JobStatusDetailsSkeleton() {
    return (
        <div className="p-8 space-y-7 animate-pulse">
            <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-slate-200 flex-shrink-0" />
                <div className="flex-1 space-y-2 pt-0.5">
                    <div className="h-5 w-2/3 rounded-xl bg-slate-200" />
                    <div className="h-3.5 w-1/3 rounded-lg bg-slate-100" />
                    <div className="flex gap-2 mt-1">
                        <div className="h-6 w-24 rounded-full bg-slate-100" />
                        <div className="h-6 w-16 rounded-full bg-slate-100" />
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
                <div className="h-20 rounded-2xl bg-slate-100" />
                <div className="h-20 rounded-2xl bg-slate-100" />
            </div>
            <div className="rounded-2xl border border-slate-200 p-6 space-y-5">
                <div className="h-4 w-40 rounded bg-slate-200" />
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex-shrink-0" />
                        <div className="space-y-1.5 flex-1 pt-1">
                            <div className="h-3.5 w-24 rounded bg-slate-200" />
                            <div className="h-3 w-36 rounded bg-slate-100" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function JobStatusDetails({ application }: { application: Application | null }) {
    if (!application) {
        return (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-8">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center">
                    <Briefcase className="w-7 h-7 text-slate-300" strokeWidth={1.5} />
                </div>
                <div>
                    <p className="text-base font-semibold text-slate-700 mb-1">Select a job</p>
                    <p className="text-sm text-slate-400 max-w-xs">
                        Click any application on the left to view its status and timeline.
                    </p>
                </div>
            </div>
        );
    }

    const { job, status, createdAt, viewedAt, shortlistedAt, rejectedAt } = application;
    const config = getStatusConfig(status);
    const StatusIcon = config.icon;
    const modeLower = (job.mode ?? "").toLowerCase();
    const modeBadge = MODE_STYLES[modeLower] ?? "bg-slate-100 text-slate-500 border-slate-200";

    const steps = [
        {
            title: "Applied",
            desc: "Your application was submitted successfully.",
            date: createdAt,
            done: !!createdAt,
            icon: CheckCircle2,
            color: "bg-indigo-500",
        },
        {
            title: "Viewed",
            desc: "A recruiter reviewed your application.",
            date: viewedAt,
            done: !!viewedAt,
            icon: Eye,
            color: "bg-blue-500",
        },
        {
            title: "Shortlisted",
            desc: "You've been shortlisted for the next stage.",
            date: shortlistedAt,
            done: !!shortlistedAt,
            icon: Star,
            color: "bg-emerald-500",
        },
        {
            title: "Decision",
            desc: status === "REJECTED"
                ? "Your application was not selected this time."
                : "Awaiting final decision from the recruiter.",
            date: status === "REJECTED" ? rejectedAt : null,
            done: status === "REJECTED" || status === "SHORTLISTED",
            icon: status === "REJECTED" ? XCircle : CheckCircle2,
            color: status === "REJECTED" ? "bg-red-500" : "bg-emerald-500",
        },
    ];

    return (
        <div className="p-6 sm:p-8 space-y-7 max-w-2xl">

            {/* Header */}
            <div className="flex items-start gap-4">
                <CompanyAvatar name={job.company.companyName} image={job.company.companyImage} />
                <div className="flex-1 min-w-0">
                    <h1 className="text-xl font-bold text-slate-900 leading-snug mb-0.5">{job.jobTitle}</h1>
                    <p className="text-sm text-slate-500">{job.company.companyName}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-3">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border ${config.bg} ${config.text} ${config.border}`}>
                            <StatusIcon className="w-3.5 h-3.5" strokeWidth={2} />
                            {config.label}
                        </span>
                        {job.mode && (
                            <span className={`inline-flex items-center text-xs font-medium px-3 py-1 rounded-full border capitalize ${modeBadge}`}>
                                {job.mode}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-1">Applied on</p>
                    <p className="text-sm font-bold text-slate-800">{formatDate(createdAt)}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-1">Last update</p>
                    <p className="text-sm font-bold text-slate-800">
                        {formatDate(shortlistedAt ?? viewedAt ?? createdAt)}
                    </p>
                </div>
            </div>

            {/* Timeline */}
            <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100">
                    <h2 className="text-sm font-bold text-slate-800">Application Timeline</h2>
                </div>
                <div className="px-6 py-5">
                    <ol className="space-y-0">
                        {steps.map((step, i) => {
                            const StepIcon = step.icon;
                            const isLast = i === steps.length - 1;

                            return (
                                <li key={step.title} className="flex gap-4">
                                    {/* Circle + connector */}
                                    <div className="flex flex-col items-center">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-all duration-300 ${
                                            step.done
                                                ? `${step.color} border-transparent`
                                                : "bg-white border-slate-200"
                                        }`}>
                                            <StepIcon className={`w-4 h-4 ${step.done ? "text-white" : "text-slate-300"}`} strokeWidth={2} />
                                        </div>
                                        {!isLast && (
                                            <div className={`w-0.5 flex-1 my-1 min-h-[24px] rounded-full ${step.done ? "bg-slate-200" : "bg-slate-100"}`} />
                                        )}
                                    </div>

                                    {/* Text */}
                                    <div className={`flex-1 ${isLast ? "pb-0" : "pb-5"}`}>
                                        <div className="flex items-baseline justify-between gap-2 flex-wrap">
                                            <p className={`text-sm font-semibold ${step.done ? "text-slate-800" : "text-slate-400"}`}>
                                                {step.title}
                                            </p>
                                            <span className={`text-xs tabular-nums ${step.done ? "text-slate-400" : "text-slate-300"}`}>
                                                {formatDate(step.date)}
                                            </span>
                                        </div>
                                        <p className={`text-xs mt-0.5 leading-relaxed ${step.done ? "text-slate-500" : "text-slate-300"}`}>
                                            {step.desc}
                                        </p>
                                    </div>
                                </li>
                            );
                        })}
                    </ol>
                </div>
            </div>
        </div>
    );
}