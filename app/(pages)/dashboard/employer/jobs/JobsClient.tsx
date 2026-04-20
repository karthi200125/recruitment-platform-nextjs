"use client";

import Link from "next/link";
import { Briefcase, Users, Plus, Building2, ChevronRight } from "lucide-react";

interface Job {
    id: string;
    jobTitle: string;
    mode?: string;
    createdAt?: Date | string;
    company: {
        companyName: string;
        companyImage?: string | null;
    };
    _count: {
        jobApplications: number;
    };
}

interface JobsClientProps {
    jobs: Job[];
}

const MODE_STYLES: Record<string, string> = {
    remote: "bg-emerald-50 text-emerald-600 border-emerald-200",
    hybrid: "bg-violet-50 text-violet-600 border-violet-200",
    onsite: "bg-amber-50 text-amber-600 border-amber-200",
};

function formatDate(date?: Date | string): string {
    if (!date) return "";
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

export function JobsClientSkeleton() {
    return (
        <div className="p-6 sm:p-8 max-w-3xl space-y-4">
            <div className="flex items-center justify-between mb-6 animate-pulse">
                <div className="space-y-2">
                    <div className="h-6 w-28 rounded-xl bg-slate-200" />
                    <div className="h-3.5 w-40 rounded-lg bg-slate-100" />
                </div>
                <div className="h-10 w-32 rounded-xl bg-slate-200" />
            </div>
            {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-2xl border border-slate-200 bg-white p-5 animate-pulse">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1">
                            <div className="w-11 h-11 rounded-xl bg-slate-200 flex-shrink-0" />
                            <div className="flex-1 space-y-2 pt-0.5">
                                <div className="h-4 w-2/3 rounded-lg bg-slate-200" />
                                <div className="h-3 w-1/3 rounded-lg bg-slate-100" />
                                <div className="flex gap-2 mt-2">
                                    <div className="h-5 w-16 rounded-full bg-slate-100" />
                                    <div className="h-5 w-24 rounded-full bg-slate-100" />
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-2 flex-shrink-0">
                            <div className="h-8 w-24 rounded-xl bg-slate-100" />
                            <div className="h-4 w-4 rounded bg-slate-100" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function JobsClient({ jobs }: JobsClientProps) {

    if (!jobs || jobs.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-5">
                    <Briefcase className="w-7 h-7 text-slate-400" strokeWidth={1.5} />
                </div>
                <h2 className="text-lg font-bold text-slate-800 mb-2">No jobs posted yet</h2>
                <p className="text-sm text-slate-400 max-w-xs leading-relaxed mb-6">
                    You haven't posted any jobs yet. Create your first listing and start receiving applications.
                </p>
                <Link
                    href="/dashboard/employer/post-job"
                    className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors duration-200 shadow-sm shadow-indigo-200"
                >
                    <Plus className="w-4 h-4" />
                    Post your first job
                </Link>
            </div>
        );
    }

    const totalApplicants = jobs.reduce((sum, j) => sum + j._count.jobApplications, 0);

    return (
        <div className="p-6 sm:p-8 max-w-3xl">

            {/* Header */}
            <div className="flex items-start justify-between gap-4 mb-7">
                <div>
                    <h1 className="text-xl font-bold text-slate-900">Your Jobs</h1>
                    <p className="text-sm text-slate-400 mt-0.5">
                        {jobs.length} listing{jobs.length !== 1 ? "s" : ""} · {totalApplicants} total applicant{totalApplicants !== 1 ? "s" : ""}
                    </p>
                </div>
                <Link
                    href="/dashboard/employer/post-job"
                    className="inline-flex items-center gap-2 flex-shrink-0 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors duration-200 shadow-sm shadow-indigo-200"
                >
                    <Plus className="w-4 h-4" />
                    Post a job
                </Link>
            </div>

            {/* Job list */}
            <div className="space-y-3">
                {jobs.map((job) => {
                    const modeLower = (job.mode ?? "").toLowerCase();
                    const modeBadge = MODE_STYLES[modeLower];
                    const count = job._count.jobApplications;

                    return (
                        <Link
                            key={job.id}
                            href={`/dashboard/employer/job/${job.id}`}
                            className="group flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 hover:border-indigo-300 hover:shadow-md hover:shadow-indigo-500/[0.06] hover:-translate-y-0.5 transition-all duration-200"
                        >
                            <CompanyAvatar name={job.company.companyName} image={job.company.companyImage} />

                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-slate-800 group-hover:text-indigo-700 transition-colors duration-200 leading-snug truncate">
                                    {job.jobTitle}
                                </p>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    <Building2 className="w-3 h-3 text-slate-400 flex-shrink-0" strokeWidth={1.75} />
                                    <p className="text-xs text-slate-400 truncate">{job.company.companyName}</p>
                                </div>
                                <div className="flex flex-wrap items-center gap-2 mt-2.5">
                                    {modeBadge && (
                                        <span className={`inline-flex items-center text-[11px] font-semibold px-2.5 py-0.5 rounded-full border capitalize ${modeBadge}`}>
                                            {job.mode}
                                        </span>
                                    )}
                                    {job.createdAt && (
                                        <span className="text-[11px] text-slate-400">
                                            Posted {formatDate(job.createdAt)}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col items-end gap-2 flex-shrink-0">
                                <div className="flex items-center gap-1.5 rounded-xl bg-indigo-50 border border-indigo-100 px-3 py-1.5">
                                    <Users className="w-3.5 h-3.5 text-indigo-500" strokeWidth={2} />
                                    <span className="text-xs font-bold text-indigo-700">
                                        {count} {count === 1 ? "Applicant" : "Applicants"}
                                    </span>
                                </div>
                                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all duration-200" />
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}