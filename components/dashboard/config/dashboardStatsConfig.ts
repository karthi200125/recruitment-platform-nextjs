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
            key: "appliedJobsCount",
            label: "Applied Jobs",
            icon: BriefcaseBusiness,
            href: "/dashboard?tab=applied",
            trend: "12.5%",
            iconBg: "bg-emerald-50",
            iconColor: "text-emerald-600",
            chartColor: "#16a34a",
        },

        {
            key: "savedJobsCount",

            label: "Saved Jobs",

            icon: Bookmark,

            href: "/dashboard?tab=saved",

            trend: "8.1%",

            iconBg: "bg-violet-50",

            iconColor:
                "text-violet-600",

            chartColor: "#7c3aed",
        },

        {
            key: "interviewsCount",

            label: "Interviews",

            icon: Clock3,

            trend: "20%",

            iconBg: "bg-sky-50",

            iconColor: "text-sky-600",

            chartColor: "#2563eb",
        },

        {
            key: "profileViewsCount",

            label: "Profile Views",

            icon: Eye,

            href: "/dashboard?tab=profileViews",

            trend: "-5.2%",

            iconBg: "bg-rose-50",

            iconColor: "text-rose-600",

            chartColor: "#dc2626",
        },
    ],

    RECRUITER: [
        {
            key: "postedJobsCount",

            label: "Posted Jobs",

            icon: BriefcaseBusiness,

            trend: "12.5%",

            iconBg: "bg-emerald-50",

            iconColor:
                "text-emerald-600",

            chartColor: "#16a34a",
        },

        {
            key: "totalApplicationsCount",

            label: "Applicants",

            icon: Users,

            trend: "8.1%",

            iconBg: "bg-violet-50",

            iconColor:
                "text-violet-600",

            chartColor: "#7c3aed",
        },

        {
            key: "hiredCandidatesCount",

            label: "Hired",

            icon: BadgeCheck,

            trend: "20%",

            iconBg: "bg-sky-50",

            iconColor: "text-sky-600",

            chartColor: "#2563eb",
        },

        {
            key: "interviewsCount",

            label: "Interviews",

            icon: Clock3,

            trend: "-5.2%",

            iconBg: "bg-rose-50",

            iconColor: "text-rose-600",

            chartColor: "#dc2626",
        },
    ],

    ORGANIZATION: [
        {
            key: "totalJobsCount",

            label: "Active Jobs",

            icon: Building2,

            trend: "12.5%",

            iconBg: "bg-emerald-50",

            iconColor:
                "text-emerald-600",

            chartColor: "#16a34a",
        },

        {
            key: "totalApplicantsCount",

            label: "Applicants",

            icon: Users,

            trend: "8.1%",

            iconBg: "bg-violet-50",

            iconColor:
                "text-violet-600",

            chartColor: "#7c3aed",
        },

        {
            key: "activeJobsCount",

            label: "Active Jobs",

            icon: UserCog,

            trend: "20%",

            iconBg: "bg-sky-50",

            iconColor: "text-sky-600",

            chartColor: "#2563eb",
        },

        {
            key: "hiredCandidatesCount",

            label: "Hired",

            icon: BadgeCheck,

            trend: "-5.2%",

            iconBg: "bg-rose-50",

            iconColor: "text-rose-600",

            chartColor: "#dc2626",
        },
    ],
};