"use client";

import { ApplicantApplication } from "@/types/applicants";
import { Mail, Phone, FileText, Users } from "lucide-react";
import { CompanyAvatar } from "../../jobStatus/Companyavatar";
import { ApplicantStatusDropdown } from "./Applicantstatusdropdown";
import { getStatusConfig } from "@/lib/dashboard/application-status";
import { formatDate } from "../../jobStatus/JobStatusDetails";

interface ApplicantDetailsProps {
    applicant: ApplicantApplication | null;
    jobSkills: string[];
}

const STEP_DESCRIPTIONS: Record<string, string> = {
    APPLIED: "Application submitted.",
    VIEWED: "You viewed this application.",
    UNDER_REVIEW: "Marked as under review.",
    SHORTLISTED: "Shortlisted for next stage.",
    INTERVIEW_SCHEDULED: "Interview scheduled.",
    INTERVIEWED: "Interview completed.",
    HIRED: "Candidate hired.",
    REJECTED: "Application rejected.",
    WITHDRAWN: "Candidate withdrew.",
};

export function ApplicantDetails({ applicant, jobSkills }: ApplicantDetailsProps) {
    if (!applicant) {
        return (
            <div className="flex h-full flex-col items-center justify-center gap-4 px-8 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
                    <Users className="h-7 w-7 text-slate-300" strokeWidth={1.5} />
                </div>
                <div>
                    <p className="mb-1 text-base font-semibold text-slate-700">Select an applicant</p>
                    <p className="max-w-xs text-sm text-slate-400">
                        Click any candidate on the left to view their full details.
                    </p>
                </div>
            </div>
        );
    }

    const displayName =
        applicant.user.firstName || applicant.user.lastName
            ? `${applicant.user.firstName ?? ""} ${applicant.user.lastName ?? ""}`.trim()
            : applicant.user.username;

    const matchedSkillSet = new Set(jobSkills.map((s) => s.trim().toLowerCase()));

    return (
        <div className="max-w-2xl space-y-7 p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                    <CompanyAvatar name={displayName} image={applicant.user.profileImage} size={56} />
                    <div>
                        <h1 className="text-xl font-bold text-slate-900">{displayName}</h1>
                        {applicant.user.profession && <p className="text-sm text-slate-500">{applicant.user.profession}</p>}
                        {applicant.user.city && <p className="text-xs text-slate-400">{applicant.user.city}</p>}
                    </div>
                </div>

                <ApplicantStatusDropdown applicationId={applicant.id} currentStatus={applicant.status} />
            </div>

            {applicant.matchPercent > 0 && (
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-5 py-4">
                    <p className="text-sm font-semibold text-emerald-700">
                        {applicant.matchPercent}% skill match ({applicant.matchedSkillsCount} of {jobSkills.length} required skills)
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                        {applicant.user.skills.map((skill) => {
                            const isMatch = matchedSkillSet.has(skill.trim().toLowerCase());
                            return (
                                <span
                                    key={skill}
                                    className={`rounded-full border px-2.5 py-1 text-xs font-medium ${isMatch ? "border-emerald-200 bg-white text-emerald-700" : "border-slate-200 bg-white text-slate-500"
                                        }`}
                                >
                                    {skill}
                                </span>
                            );
                        })}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">
                    <Mail className="h-4 w-4 flex-shrink-0 text-slate-400" />
                    <div className="min-w-0">
                        <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Email</p>
                        <p className="truncate text-sm font-medium text-slate-800">{applicant.candidateEmail}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">
                    <Phone className="h-4 w-4 flex-shrink-0 text-slate-400" />
                    <div className="min-w-0">
                        <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Phone</p>
                        <p className="truncate text-sm font-medium text-slate-800">{applicant.candidateMobile}</p>
                    </div>
                </div>
            </div>

            <a
                href={applicant.candidateResume}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-indigo-200 hover:bg-indigo-50"
            >
                <FileText className="h-8 w-8 flex-shrink-0 text-indigo-500" />
                <div>
                    <p className="text-sm font-medium text-slate-900">View Resume</p>
                    <p className="text-xs text-slate-500">Opens in a new tab</p>
                </div>
            </a>

            {applicant.questionAndAnswers && applicant.questionAndAnswers.length > 0 && (
                <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-slate-900">Screening Questions</h3>
                    <div className="space-y-3 rounded-2xl border border-slate-200 p-5">
                        {applicant.questionAndAnswers.map((qa) => (
                            <div key={qa.id}>
                                <p className="text-sm text-slate-500">{qa.question}</p>
                                <p className="font-medium text-slate-900">{qa.answer || "-"}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <div className="border-b border-slate-100 px-6 py-4">
                    <h2 className="text-sm font-bold text-slate-800">Status Timeline</h2>
                </div>
                <div className="px-6 py-5">
                    <ol className="space-y-0">
                        {applicant.statusHistory.map((entry, i) => {
                            const stepConfig = getStatusConfig(entry.status);
                            const StepIcon = stepConfig.icon;
                            const isLast = i === applicant.statusHistory.length - 1;

                            return (
                                <li key={entry.id} className="flex gap-4">
                                    <div className="flex flex-col items-center">
                                        <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${stepConfig.dotColor}`}>
                                            <StepIcon className="h-4 w-4 text-white" strokeWidth={2} />
                                        </div>
                                        {!isLast && <div className="my-1 min-h-[24px] w-0.5 flex-1 rounded-full bg-slate-200" />}
                                    </div>
                                    <div className={isLast ? "flex-1 pb-0" : "flex-1 pb-5"}>
                                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                                            <p className="text-sm font-semibold text-slate-800">{stepConfig.label}</p>
                                            <span className="text-xs tabular-nums text-slate-400">{formatDate(entry.createdAt)}</span>
                                        </div>
                                        <p className="mt-0.5 text-xs leading-relaxed text-slate-500">
                                            {STEP_DESCRIPTIONS[entry.status] ?? ""}
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