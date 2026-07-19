import { getStatusConfig } from "@/lib/dashboard/application-status";
import { CandidateApplication } from "@/types/candidate-application";
import { Briefcase } from "lucide-react";
import { CompanyAvatar } from "./Companyavatar";
import { buildTimelineSteps } from "@/lib/Buildtimelinesteps";

interface JobStatusDetailsProps {
    application: CandidateApplication | null;
}

export function formatDate(date: Date | string | null | undefined): string {
    if (!date) return "Pending";
    return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(
        new Date(date)
    );
}

const MODE_STYLES: Record<string, string> = {
    remote: "bg-emerald-50 text-emerald-600 border-emerald-200",
    hybrid: "bg-violet-50 text-violet-600 border-violet-200",
    onsite: "bg-amber-50 text-amber-600 border-amber-200",
};

const STEP_DESCRIPTIONS: Record<string, string> = {
    APPLIED: "Your application was submitted successfully.",
    VIEWED: "A recruiter reviewed your application.",
    UNDER_REVIEW: "Your application is being reviewed by the team.",
    SHORTLISTED: "You've been shortlisted for the next stage.",
    INTERVIEW_SCHEDULED: "An interview has been scheduled.",
    INTERVIEWED: "Your interview has been completed.",
    HIRED: "Congratulations — you've been hired!",
    REJECTED: "Your application was not selected this time.",
    WITHDRAWN: "You withdrew this application.",
};

export default function JobStatusDetails({ application }: JobStatusDetailsProps) {
    if (!application) {
        return (
            <div className="flex h-full flex-col items-center justify-center gap-4 px-8 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
                    <Briefcase className="h-7 w-7 text-slate-300" strokeWidth={1.5} />
                </div>
                <div>
                    <p className="mb-1 text-base font-semibold text-slate-700">Select a job</p>
                    <p className="max-w-xs text-sm text-slate-400">
                        Click any application on the left to view its status and timeline.
                    </p>
                </div>
            </div>
        );
    }

    const { job, status, createdAt } = application;
    const config = getStatusConfig(status);
    const StatusIcon = config.icon;
    const modeBadge = MODE_STYLES[job.mode.toLowerCase()] ?? "bg-slate-100 text-slate-500 border-slate-200";

    const steps = buildTimelineSteps(application);
    const lastUpdate = steps[steps.length - 1]?.date ?? createdAt;

    return (
        <div className="max-w-2xl space-y-7 p-6 sm:p-8">
            <div className="flex items-start gap-4">
                <CompanyAvatar name={job.company.companyName} image={job.company.companyImage} size={44} />
                <div className="min-w-0 flex-1">
                    <h1 className="mb-0.5 text-xl font-bold leading-snug text-slate-900">{job.jobTitle}</h1>
                    <p className="text-sm text-slate-500">{job.company.companyName}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                        <span
                            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${config.bg} ${config.text} ${config.border}`}
                        >
                            <StatusIcon className="h-3.5 w-3.5" strokeWidth={2} />
                            {config.label}
                        </span>
                        {job.mode && (
                            <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium capitalize ${modeBadge}`}>
                                {job.mode}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">
                    <p className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-slate-400">Applied on</p>
                    <p className="text-sm font-bold text-slate-800">{formatDate(createdAt)}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">
                    <p className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-slate-400">Last update</p>
                    <p className="text-sm font-bold text-slate-800">{formatDate(lastUpdate)}</p>
                </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <div className="border-b border-slate-100 px-6 py-4">
                    <h2 className="text-sm font-bold text-slate-800">Application Timeline</h2>
                </div>
                <div className="px-6 py-5">
                    <ol className="space-y-0">
                        {steps.map((step, i) => {
                            const stepConfig = getStatusConfig(step.status);
                            const StepIcon = stepConfig.icon;
                            const isLast = i === steps.length - 1;

                            return (
                                <li key={`${step.status}-${i}`} className="flex gap-4">
                                    <div className="flex flex-col items-center">
                                        <div
                                            className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300 ${step.done ? `${stepConfig.dotColor} border-transparent` : "border-slate-200 bg-white"
                                                }`}
                                        >
                                            <StepIcon className={`h-4 w-4 ${step.done ? "text-white" : "text-slate-300"}`} strokeWidth={2} />
                                        </div>
                                        {!isLast && (
                                            <div className={`my-1 min-h-[24px] w-0.5 flex-1 rounded-full ${step.done ? "bg-slate-200" : "bg-slate-100"}`} />
                                        )}
                                    </div>

                                    <div className={`flex-1 ${isLast ? "pb-0" : "pb-5"}`}>
                                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                                            <p className={`text-sm font-semibold ${step.done ? "text-slate-800" : "text-slate-400"}`}>
                                                {stepConfig.label}
                                            </p>
                                            <span className={`text-xs tabular-nums ${step.done ? "text-slate-400" : "text-slate-300"}`}>
                                                {formatDate(step.date)}
                                            </span>
                                        </div>
                                        <p className={`mt-0.5 text-xs leading-relaxed ${step.done ? "text-slate-500" : "text-slate-300"}`}>
                                            {STEP_DESCRIPTIONS[step.status] ?? ""}
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