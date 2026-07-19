"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Users } from "lucide-react";
import { ApplicantApplication } from "@/types/applicants";
import { getStatusConfig } from "@/lib/dashboard/application-status";
import { CompanyAvatar } from "../../jobStatus/Companyavatar";

interface ApplicantsListProps {
    applicants: ApplicantApplication[];
    selectedId: number | null;
}

const formatShortDate = (date: Date) =>
    new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" });

export function ApplicantsList({ applicants, selectedId }: ApplicantsListProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    if (applicants.length === 0) {
        return (
            <div className="flex h-64 flex-col items-center justify-center gap-3 px-6 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100">
                    <Users className="h-5 w-5 text-slate-400" strokeWidth={1.75} />
                </div>
                <p className="text-sm font-medium text-slate-500">No applicants match these filters</p>
            </div>
        );
    }

    const handleSelect = (applicantId: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("applicantId", String(applicantId));
        router.push(`?${params.toString()}`, { scroll: false });
    };

    return (
        <div className="divide-y divide-slate-100">
            {applicants.map((applicant) => {
                const isActive = applicant.id === selectedId;
                const config = getStatusConfig(applicant.status);
                const StatusIcon = config.icon;
                const displayName =
                    applicant.user.firstName || applicant.user.lastName
                        ? `${applicant.user.firstName ?? ""} ${applicant.user.lastName ?? ""}`.trim()
                        : applicant.user.username;

                return (
                    <button
                        type="button"
                        key={applicant.id}
                        onClick={() => handleSelect(applicant.id)}
                        className={`flex w-full items-start gap-3 border-l-[3px] p-4 text-left transition-all duration-200 ${isActive ? "border-indigo-500 bg-indigo-50" : "border-transparent hover:bg-slate-50"
                            }`}
                    >
                        <CompanyAvatar name={displayName} image={applicant.user.profileImage} />

                        <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2">
                                <p className={`truncate text-sm font-semibold ${isActive ? "text-indigo-900" : "text-slate-800"}`}>
                                    {displayName}
                                </p>
                                {applicant.matchPercent > 0 && (
                                    <span className="flex-shrink-0 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                                        {applicant.matchPercent}% match
                                    </span>
                                )}
                            </div>

                            <p className="mt-0.5 truncate text-xs text-slate-400">{applicant.user.profession ?? applicant.candidateEmail}</p>

                            <div className="mt-2 flex items-center gap-2">
                                <span
                                    className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${config.bg} ${config.text} ${config.border}`}
                                >
                                    <StatusIcon className="h-2.5 w-2.5" strokeWidth={2} />
                                    {config.label}
                                </span>
                                <span className="text-[11px] text-slate-400">{formatShortDate(applicant.appliedAt)}</span>
                            </div>
                        </div>
                    </button>
                );
            })}
        </div>
    );
}