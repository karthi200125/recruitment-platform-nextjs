"use client";

import Link from "next/link";
import {
    Building2,
    ChevronLeft,
    Users,
} from "lucide-react";

import ApplicantDetails, {
    ApplicantDetailsSkeleton,
} from "./ApplicantDetails";
import ApplicantList, {
    ApplicantListSkeleton,
} from "./ApplicantList";

import {
    JobApplicationWithUser,
    JobWithCompanyAndCount,
} from "@/types";

interface EmployerJobClientProps {
    job: JobWithCompanyAndCount;
    applicants: JobApplicationWithUser[];
    selectedApplication: JobApplicationWithUser | null;
    isLoading?: boolean;
}

const MODE_STYLES: Record<string, string> = {
    remote:
        "bg-emerald-50 text-emerald-600 border-emerald-200",
    hybrid:
        "bg-violet-50 text-violet-600 border-violet-200",
    onsite:
        "bg-amber-50 text-amber-600 border-amber-200",
};

export default function EmployerJobClient({
    job,
    applicants,
    selectedApplication,
    isLoading = false,
}: EmployerJobClientProps) {
    const applicantCount =
        job._count.jobApplications;

    const mode =
        job.mode?.toLowerCase() ?? "";

    const modeBadge =
        MODE_STYLES[mode];

    return (
        <div className="flex h-[calc(100vh-64px)] flex-col bg-slate-50">
            {/* Header */}
            <div className="flex-shrink-0 border-b border-slate-200 bg-white px-5 py-4">
                <div className="flex max-w-full items-start justify-between gap-4">
                    {/* Left */}
                    <div className="flex min-w-0 items-start gap-3">
                        <Link
                            href="/dashboard/employer/jobs"
                            className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-colors duration-200 hover:bg-slate-50 hover:text-slate-700"
                            aria-label="Back to jobs"
                        >
                            <ChevronLeft
                                className="h-4 w-4"
                                strokeWidth={2}
                            />
                        </Link>

                        <div className="min-w-0">
                            <h1 className="truncate text-base font-bold leading-snug text-slate-900">
                                {job.jobTitle}
                            </h1>

                            <div className="mt-0.5 flex items-center gap-1.5">
                                <Building2
                                    className="h-3 w-3 flex-shrink-0 text-slate-400"
                                    strokeWidth={1.75}
                                />

                                <p className="truncate text-xs text-slate-400">
                                    {
                                        job.company
                                            .companyName
                                    }
                                </p>
                            </div>

                            {modeBadge && (
                                <div className="mt-2 flex flex-wrap items-center gap-2">
                                    <span
                                        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold capitalize ${modeBadge}`}
                                    >
                                        {job.mode}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right */}
                    <div className="flex flex-shrink-0 items-center gap-1.5 rounded-xl border border-indigo-100 bg-indigo-50 px-3 py-2">
                        <Users
                            className="h-4 w-4 text-indigo-500"
                            strokeWidth={2}
                        />

                        <span className="text-sm font-bold text-indigo-700">
                            {applicantCount}{" "}
                            {applicantCount === 1
                                ? "Applicant"
                                : "Applicants"}
                        </span>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex flex-1 overflow-hidden">
                {/* Left */}
                <div className="flex w-full flex-shrink-0 flex-col overflow-hidden border-r border-slate-100 bg-white md:w-[400px] lg:w-[500px]">
                    <div className="flex-shrink-0 border-b border-slate-100 px-4 py-3">
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-600">
                            Candidates
                        </p>
                    </div>

                    <div className="flex flex-1 flex-col overflow-hidden">
                        {isLoading ? (
                            <ApplicantListSkeleton />
                        ) : (
                            <ApplicantList
                                applicants={
                                    applicants
                                }
                            />
                        )}
                    </div>
                </div>

                {/* Right */}
                <div className="hidden flex-1 flex-col overflow-y-auto bg-slate-50/50 md:flex">
                    {isLoading ? (
                        <ApplicantDetailsSkeleton />
                    ) : (
                        <ApplicantDetails
                            application={
                                selectedApplication
                            }
                        />
                    )}
                </div>
            </div>
        </div>
    );
}