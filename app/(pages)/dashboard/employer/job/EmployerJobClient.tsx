"use client";

import { Briefcase, Users, Building2, ChevronLeft } from "lucide-react";
import Link from "next/link";
import ApplicantList, { ApplicantListSkeleton } from "./ApplicantList";
import ApplicantDetails, { ApplicantDetailsSkeleton } from "./ApplicantDetails";

interface Company {
    companyName: string;
    companyImage?: string | null;
}

interface Job {
    jobTitle: string;
    mode?: string;
    company: Company;
    _count: {
        jobApplications: number;
    };
}

interface Application {
    id: number;
    status: any;
    createdAt: Date | string;
    candidateResume?: string | null;
    questionAndAnswers?: Record<string, any>;
    user: {
        username: string;
        email?: string;
        image?: string | null;
    };
}

interface EmployerJobClientProps {
    job: Job;
    applicants: Application[];
    selectedApplication: Application | null;
    isLoading?: boolean;
}

const MODE_STYLES: Record<string, string> = {
    remote: "bg-emerald-50 text-emerald-600 border-emerald-200",
    hybrid: "bg-violet-50 text-violet-600 border-violet-200",
    onsite: "bg-amber-50 text-amber-600 border-amber-200",
};

export default function EmployerJobClient({
    job,
    applicants,
    selectedApplication,
    isLoading = false,
}: EmployerJobClientProps) {
    const count = job._count.jobApplications;
    const modeLower = (job.mode ?? "").toLowerCase();
    const modeBadge = MODE_STYLES[modeLower];

    return (
        <div className="flex flex-col h-[calc(100vh-64px)] bg-slate-50">

            {/* Header */}
            <div className="flex-shrink-0 bg-white border-b border-slate-200 px-5 py-4">
                <div className="flex items-start justify-between gap-4 max-w-full">

                    {/* Left — back + job info */}
                    <div className="flex items-start gap-3 min-w-0">
                        <Link
                            href="/dashboard/employer/jobs"
                            className="mt-0.5 flex-shrink-0 w-8 h-8 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors duration-200"
                            aria-label="Back to jobs"
                        >
                            <ChevronLeft className="w-4 h-4" strokeWidth={2} />
                        </Link>
                        <div className="min-w-0">
                            <h1 className="text-base font-bold text-slate-900 leading-snug truncate">
                                {job.jobTitle}
                            </h1>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <Building2 className="w-3 h-3 text-slate-400 flex-shrink-0" strokeWidth={1.75} />
                                <p className="text-xs text-slate-400 truncate">{job.company.companyName}</p>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 mt-2">
                                {modeBadge && (
                                    <span className={`inline-flex items-center text-[11px] font-semibold px-2.5 py-0.5 rounded-full border capitalize ${modeBadge}`}>
                                        {job.mode}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right — applicant count */}
                    <div className="flex items-center gap-1.5 flex-shrink-0 rounded-xl bg-indigo-50 border border-indigo-100 px-3 py-2">
                        <Users className="w-4 h-4 text-indigo-500" strokeWidth={2} />
                        <span className="text-sm font-bold text-indigo-700">
                            {count} {count === 1 ? "Applicant" : "Applicants"}
                        </span>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex flex-1 overflow-hidden">

                {/* LEFT — applicant list */}
                <div className="w-full md:w-[400px] lg:w-[500px] flex-shrink-0 flex flex-col border-r border-slate-100 bg-white overflow-hidden">

                    {/* List panel header */}
                    <div className="px-4 py-3 border-b border-slate-100 flex-shrink-0">
                        <p className="text-xs font-bold text-slate-600 uppercase tracking-widest">Candidates</p>
                    </div>

                    <div className="flex-1 overflow-hidden flex flex-col">
                        {isLoading
                            ? <ApplicantListSkeleton />
                            : <ApplicantList applicants={applicants} />
                        }
                    </div>
                </div>

                {/* RIGHT — applicant details */}
                <div className="hidden md:flex flex-col flex-1 overflow-y-auto bg-slate-50/50">
                    {isLoading
                        ? <ApplicantDetailsSkeleton />
                        : <ApplicantDetails application={selectedApplication} />
                    }
                </div>
            </div>
        </div>
    );
}