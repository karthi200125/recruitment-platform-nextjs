import { ApplicationStatus } from "@prisma/client";

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  APPLIED: "Applied",
  VIEWED: "Viewed",
  UNDER_REVIEW: "Under Review",
  SHORTLISTED: "Shortlisted",
  INTERVIEW_SCHEDULED: "Interview Scheduled",
  INTERVIEWED: "Interviewed",
  HIRED: "Hired",
  REJECTED: "Rejected",
  WITHDRAWN: "Withdrawn",
};

export const APPLICATION_STATUS_STYLES: Record<
  ApplicationStatus,
  string
> = {
  APPLIED:
    "bg-sky-50 text-sky-700 border border-sky-200",

  VIEWED:
    "bg-violet-50 text-violet-700 border border-violet-200",

  UNDER_REVIEW:
    "bg-amber-50 text-amber-700 border border-amber-200",

  SHORTLISTED:
    "bg-emerald-50 text-emerald-700 border border-emerald-200",

  INTERVIEW_SCHEDULED:
    "bg-indigo-50 text-indigo-700 border border-indigo-200",

  INTERVIEWED:
    "bg-cyan-50 text-cyan-700 border border-cyan-200",

  HIRED:
    "bg-green-50 text-green-700 border border-green-200",

  REJECTED:
    "bg-red-50 text-red-700 border border-red-200",

  WITHDRAWN:
    "bg-slate-100 text-slate-700 border border-slate-200",
};

export const ACTIVE_APPLICATION_STATUSES: ApplicationStatus[] = [
  "APPLIED",
  "VIEWED",
  "UNDER_REVIEW",
  "SHORTLISTED",
  "INTERVIEW_SCHEDULED",
  "INTERVIEWED",
];

export const CLOSED_APPLICATION_STATUSES: ApplicationStatus[] = [
  "HIRED",
  "REJECTED",
  "WITHDRAWN",
];

export const APPLICATION_STATUS_OPTIONS = Object.values(
  ApplicationStatus
).map((status) => ({
  value: status,
  label: APPLICATION_STATUS_LABELS[status],
}));

export const getApplicationStatusLabel = (
  status: ApplicationStatus
) => {
  return APPLICATION_STATUS_LABELS[status];
};

export const getApplicationStatusStyle = (
  status: ApplicationStatus
) => {
  return APPLICATION_STATUS_STYLES[status];
};