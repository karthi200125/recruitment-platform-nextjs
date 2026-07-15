import {
    BadgeCheck,
    Bookmark,
    BriefcaseBusiness,
    Clock3,
    Eye,
    Users,
} from "lucide-react";
import { Role } from "@prisma/client";

import { DashboardStatItem } from "@/types/dashboard";

export const DASHBOARD_STATS_CONFIG: Record<
    Role,
    DashboardStatItem[]
> = {
    CANDIDATE: [
        {
            key: "appliedJobs",
            label: "Applied Jobs",
            icon: BriefcaseBusiness,
            href: "/dashboard?tab=applied",
            iconBg: "bg-emerald-50",
            iconColor: "text-emerald-600",
            chartColor: "#16a34a",
        },
        {
            key: "savedJobs",
            label: "Saved Jobs",
            icon: Bookmark,
            href: "/dashboard?tab=saved",
            iconBg: "bg-violet-50",
            iconColor: "text-violet-600",
            chartColor: "#7c3aed",
        },
        {
            key: "interviews",
            label: "Interviews",
            icon: Clock3,
            href: "/dashboard?tab=interviews",
            iconBg: "bg-sky-50",
            iconColor: "text-sky-600",
            chartColor: "#2563eb",
        },
        {
            key: "profileViews",
            label: "Profile Views",
            icon: Eye,
            href: "/dashboard?tab=profileViews",
            iconBg: "bg-rose-50",
            iconColor: "text-rose-600",
            chartColor: "#dc2626",
        },
    ],

    RECRUITER: [
        {
            key: "postedJobs",
            label: "Posted Jobs",
            icon: BriefcaseBusiness,
            href: "/dashboard?tab=postedJobs",
            iconBg: "bg-emerald-50",
            iconColor: "text-emerald-600",
            chartColor: "#16a34a",
        },
        {
            key: "applicants",
            label: "Applicants",
            icon: Users,
            href: "/dashboard?tab=applicants",
            iconBg: "bg-violet-50",
            iconColor: "text-violet-600",
            chartColor: "#7c3aed",
        },
        {
            key: "interviews",
            label: "Interviews",
            icon: Clock3,
            href: "/dashboard?tab=interviews",
            iconBg: "bg-sky-50",
            iconColor: "text-sky-600",
            chartColor: "#2563eb",
        },
        {
            key: "hiredCandidates",
            label: "Hired",
            icon: BadgeCheck,
            href: "/dashboard?tab=hired",
            iconBg: "bg-rose-50",
            iconColor: "text-rose-600",
            chartColor: "#dc2626",
        },
    ],

    ORGANIZATION: [
        {
            key: "employees",
            label: "Employees",
            icon: Users,
            href: "/dashboard?tab=employees",
            iconBg: "bg-emerald-50",
            iconColor: "text-emerald-600",
            chartColor: "#16a34a",
        },
        {
            key: "jobs",
            label: "Jobs",
            icon: BriefcaseBusiness,
            href: "/dashboard?tab=jobs",
            iconBg: "bg-violet-50",
            iconColor: "text-violet-600",
            chartColor: "#7c3aed",
        },
        {
            key: "applicants",
            label: "Applicants",
            icon: Users,
            href: "/dashboard?tab=applicants",
            iconBg: "bg-sky-50",
            iconColor: "text-sky-600",
            chartColor: "#2563eb",
        },
        {
            key: "hiredCandidates",
            label: "Hired",
            icon: BadgeCheck,
            href: "/dashboard?tab=hired",
            iconBg: "bg-rose-50",
            iconColor: "text-rose-600",
            chartColor: "#dc2626",
        },
    ],
};