import {
    BadgeCheck,
    Bookmark,
    BriefcaseBusiness,
    CalendarDays,
    CircleCheckBig,
    Eye,
    LucideIcon,
    User,
    XCircle,
} from "lucide-react";

import { DashboardActivityType } from "@/types/dashboard";

interface ActivityConfig {
    icon: LucideIcon;
    iconClass: string;
    wrapperClass: string;
}

const ACTIVITY_CONFIG: Record<
    DashboardActivityType,
    ActivityConfig
> = {
    application: {
        icon: BriefcaseBusiness,
        iconClass: "text-sky-600",
        wrapperClass: "bg-sky-50",
    },

    view: {
        icon: Eye,
        iconClass: "text-blue-600",
        wrapperClass: "bg-blue-50",
    },

    saved: {
        icon: Bookmark,
        iconClass: "text-amber-600",
        wrapperClass: "bg-amber-50",
    },

    shortlisted: {
        icon: CircleCheckBig,
        iconClass: "text-emerald-600",
        wrapperClass: "bg-emerald-50",
    },

    interview: {
        icon: CalendarDays,
        iconClass: "text-violet-600",
        wrapperClass: "bg-violet-50",
    },

    hired: {
        icon: BadgeCheck,
        iconClass: "text-green-600",
        wrapperClass: "bg-green-50",
    },

    rejected: {
        icon: XCircle,
        iconClass: "text-red-600",
        wrapperClass: "bg-red-50",
    },

    job: {
        icon: BriefcaseBusiness,
        iconClass: "text-indigo-600",
        wrapperClass: "bg-indigo-50",
    },

    profile: {
        icon: User,
        iconClass: "text-cyan-600",
        wrapperClass: "bg-cyan-50",
    },
};

export function getActivityConfig(
    type: DashboardActivityType
): ActivityConfig {
    return ACTIVITY_CONFIG[type];
}