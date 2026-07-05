import {
    BadgeCheck,
    Bookmark,
    BriefcaseBusiness,
    Building2,
    Clock3,
    Eye,
    UserCog,
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

            href:
                "/dashboard?tab=applied",

            iconBg:
                "bg-emerald-50",

            iconColor:
                "text-emerald-600",

            chartColor: "#16a34a",
        },

        {
            key: "savedJobs",

            label: "Saved Jobs",

            icon: Bookmark,

            href:
                "/dashboard?tab=saved",

            iconBg:
                "bg-violet-50",

            iconColor:
                "text-violet-600",

            chartColor: "#7c3aed",
        },

        {
            key: "interviews",

            label: "Interviews",

            href:
                "/dashboard?tab=interviews",

            icon: Clock3,

            iconBg:
                "bg-sky-50",

            iconColor:
                "text-sky-600",

            chartColor: "#2563eb",
        },

        {
            key: "profileViews",

            label:
                "Profile Views",

            icon: Eye,

            href:
                "/dashboard?tab=profileViews",

            iconBg:
                "bg-rose-50",

            iconColor:
                "text-rose-600",

            chartColor: "#dc2626",
        },
    ],

    // ─────────────────────────────────────────
    // Recruiter
    // ─────────────────────────────────────────

    RECRUITER: [
        {
            key:
                "postedJobsCount",

            label:
                "Posted Jobs",

            icon:
                BriefcaseBusiness,

            href:
                "/dashboard?tab=postedJobs",

            iconBg:
                "bg-emerald-50",

            iconColor:
                "text-emerald-600",

            chartColor: "#16a34a",
        },

        {
            key:
                "totalApplicationsCount",

            label:
                "Applicants",

            icon: Users,

            href:
                "/dashboard?tab=applicants",

            iconBg:
                "bg-violet-50",

            iconColor:
                "text-violet-600",

            chartColor: "#7c3aed",
        },

        {
            key:
                "interviewsCount",

            label:
                "Interviews",

            href:
                "/dashboard?tab=interviews",

            icon: Clock3,

            iconBg:
                "bg-sky-50",

            iconColor:
                "text-sky-600",

            chartColor: "#2563eb",
        },

        {
            key:
                "hiredCandidatesCount",

            label: "Hired",

            href:
                "/dashboard?tab=hired",

            icon:
                BadgeCheck,

            iconBg:
                "bg-rose-50",

            iconColor:
                "text-rose-600",

            chartColor: "#dc2626",
        },
    ],

    // ─────────────────────────────────────────
    // Organization
    // ─────────────────────────────────────────

    ORGANIZATION: [
        {
            key: "jobsCount",

            label: "Jobs",

            icon: Building2,

            href:
                "/dashboard?tab=jobs",

            iconBg:
                "bg-emerald-50",

            iconColor:
                "text-emerald-600",

            chartColor: "#16a34a",
        },

        {
            key:
                "totalApplicationsCount",

            label:
                "Applicants",

            icon: Users,

            href:
                "/dashboard?tab=applicants",

            iconBg:
                "bg-violet-50",

            iconColor:
                "text-violet-600",

            chartColor: "#7c3aed",
        },

        {
            key:
                "recruitersCount",

            label:
                "Recruiters",

            icon: UserCog,

            iconBg:
                "bg-sky-50",

            iconColor:
                "text-sky-600",

            chartColor: "#2563eb",
        },

        {
            key:
                "hiredCandidatesCount",

            label: "Hired",

            href:
                "/dashboard?tab=hired",

            icon:
                BadgeCheck,

            iconBg:
                "bg-rose-50",

            iconColor:
                "text-rose-600",

            chartColor: "#dc2626",
        },
    ],
};