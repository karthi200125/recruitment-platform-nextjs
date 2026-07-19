import { ApplicationStatus } from "@prisma/client";

import {
  Ban,
  CalendarClock,
  Clock,
  Eye,
  LucideIcon,
  Search,
  Star,
  Trophy,
  Users,
  XCircle,
} from "lucide-react";

export interface StatusConfig {
  label: string;
  bg: string;
  text: string;
  border: string;
  icon: LucideIcon;
  dotColor: string; // solid fill used for timeline circles/connectors
}

const STATUS_CONFIG: Record<ApplicationStatus, StatusConfig> = {
  APPLIED: {
    label: "Applied",
    bg: "bg-slate-100",
    text: "text-slate-600",
    border: "border-slate-200",
    icon: Clock,
    dotColor: "bg-indigo-500",
  },
  VIEWED: {
    label: "Viewed",
    bg: "bg-blue-50",
    text: "text-blue-600",
    border: "border-blue-200",
    icon: Eye,
    dotColor: "bg-blue-500",
  },
  UNDER_REVIEW: {
    label: "Under Review",
    bg: "bg-amber-50",
    text: "text-amber-600",
    border: "border-amber-200",
    icon: Search,
    dotColor: "bg-amber-500",
  },
  SHORTLISTED: {
    label: "Shortlisted",
    bg: "bg-violet-50",
    text: "text-violet-600",
    border: "border-violet-200",
    icon: Star,
    dotColor: "bg-violet-500",
  },
  INTERVIEW_SCHEDULED: {
    label: "Interview Scheduled",
    bg: "bg-sky-50",
    text: "text-sky-600",
    border: "border-sky-200",
    icon: CalendarClock,
    dotColor: "bg-sky-500",
  },
  INTERVIEWED: {
    label: "Interviewed",
    bg: "bg-indigo-50",
    text: "text-indigo-600",
    border: "border-indigo-200",
    icon: Users,
    dotColor: "bg-indigo-500",
  },
  HIRED: {
    label: "Hired",
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    border: "border-emerald-200",
    icon: Trophy,
    dotColor: "bg-emerald-500",
  },
  REJECTED: {
    label: "Rejected",
    bg: "bg-red-50",
    text: "text-red-600",
    border: "border-red-200",
    icon: XCircle,
    dotColor: "bg-red-500",
  },
  WITHDRAWN: {
    label: "Withdrawn",
    bg: "bg-slate-100",
    text: "text-slate-500",
    border: "border-slate-200",
    icon: Ban,
    dotColor: "bg-slate-400",
  },
};

export const getStatusConfig = (status: ApplicationStatus | string): StatusConfig =>
  STATUS_CONFIG[status as ApplicationStatus] ?? {
    label: status,
    bg: "bg-slate-100",
    text: "text-slate-500",
    border: "border-slate-200",
    icon: Clock,
    dotColor: "bg-slate-400",
  };







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