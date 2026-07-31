import {
    BadgeCheck,
    BriefcaseBusiness,
    Building2,
    CalendarDays,
    CircleCheckBig,
    Eye,
    LucideIcon,
    UserPlus,
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
    APPLICATION: {
        icon: BriefcaseBusiness,
        iconClass: "text-sky-600",
        wrapperClass: "bg-sky-50",
    },

    PROFILE_VIEW: {
        icon: Eye,
        iconClass: "text-blue-600",
        wrapperClass: "bg-blue-50",
    },

    UNDER_REVIEW: {
        icon: Eye,
        iconClass: "text-amber-600",
        wrapperClass: "bg-amber-50",
    },

    SHORTLISTED: {
        icon: CircleCheckBig,
        iconClass: "text-emerald-600",
        wrapperClass: "bg-emerald-50",
    },

    INTERVIEW_SCHEDULED: {
        icon: CalendarDays,
        iconClass: "text-violet-600",
        wrapperClass: "bg-violet-50",
    },

    INTERVIEWED: {
        icon: CalendarDays,
        iconClass: "text-indigo-600",
        wrapperClass: "bg-indigo-50",
    },

    HIRED: {
        icon: BadgeCheck,
        iconClass: "text-green-600",
        wrapperClass: "bg-green-50",
    },

    REJECTED: {
        icon: XCircle,
        iconClass: "text-red-600",
        wrapperClass: "bg-red-50",
    },

    WITHDRAWN: {
        icon: XCircle,
        iconClass: "text-slate-600",
        wrapperClass: "bg-slate-100",
    },

    COMPANY_VERIFIED: {
        icon: Building2,
        iconClass: "text-cyan-600",
        wrapperClass: "bg-cyan-50",
    },

    EMPLOYEE_JOINED: {
        icon: UserPlus,
        iconClass: "text-purple-600",
        wrapperClass: "bg-purple-50",
    },
};

export function getActivityConfig(
    type: DashboardActivityType
): ActivityConfig {
    return ACTIVITY_CONFIG[type];
}