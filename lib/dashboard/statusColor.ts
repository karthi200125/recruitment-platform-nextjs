import { ApplicationStatus } from "@prisma/client";

export function getStatusColor(
    status: ApplicationStatus
) {
    switch (status) {
        case "APPLIED":
            return "border border-orange-200 bg-orange-50 text-orange-700";

        case "VIEWED":
            return "border border-sky-200 bg-sky-50 text-sky-700";

        case "UNDER_REVIEW":
            return "border border-blue-200 bg-blue-50 text-blue-700";

        case "SHORTLISTED":
            return "border border-violet-200 bg-violet-50 text-violet-700";

        case "INTERVIEW_SCHEDULED":
            return "border border-indigo-200 bg-indigo-50 text-indigo-700";

        case "INTERVIEWED":
            return "border border-cyan-200 bg-cyan-50 text-cyan-700";

        case "HIRED":
            return "border border-emerald-200 bg-emerald-50 text-emerald-700";

        case "REJECTED":
            return "border border-red-200 bg-red-50 text-red-700";

        case "WITHDRAWN":
            return "border border-slate-200 bg-slate-100 text-slate-700";

        default:
            return "border border-slate-200 bg-slate-100 text-slate-700";
    }
}

export function getStatusLabel(
    status: ApplicationStatus
) {
    switch (status) {
        case "UNDER_REVIEW":
            return "Under Review";

        case "INTERVIEW_SCHEDULED":
            return "Interview Scheduled";

        case "INTERVIEWED":
            return "Interviewed";

        default:
            return status
                .toLowerCase()
                .replace(/_/g, " ")
                .replace(/\b\w/g, (char) => char.toUpperCase());
    }
}