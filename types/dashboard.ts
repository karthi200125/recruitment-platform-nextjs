// types/dashboard.ts

import { LucideIcon } from "lucide-react";
import { Role } from "@prisma/client";

import { ProfileViewWithViewer } from "./profile-view";
import { User } from "./user";
import { JobApplicationWithUser } from "./application";
import { JobWithCompany } from "./jobs";

export interface DashboardAnalyticsData {
    count: number;
    growth: number;
    isPositive: boolean;
    chartData: DashboardChartData[];
}

export interface DashboardChartData {
    value: number;
}

export interface DashboardActivityData {
    name: string;
    applications: number;
}

export interface DashboardStatusChartData {
    name: string;
    value: number;
}

export interface ProfileCompletionItem {
    label: string;
    completed: boolean;
}

export interface ProfileCompletionData {
    percentage: number;
    items: ProfileCompletionItem[];
}

export interface DashboardStatItem {
    key: string;
    label: string;
    icon: LucideIcon;
    href?: string;
    iconBg: string;
    iconColor: string;
    chartColor: string;
}

export interface DashboardStatsProps {
    role: Role;
    stats: Record<string, DashboardAnalyticsData>;
}

export interface DashboardCharts {
    applicationStatusChart?: DashboardStatusChartData[];
    applicationActivityChart?: DashboardActivityData[];

    hiringStatusChart?: DashboardStatusChartData[];
    applicantsActivityChart?: DashboardActivityData[];

    companyHiringChart?: DashboardStatusChartData[]
    recruitersPerformanceChart?: DashboardActivityData[]
}

export type DashboardActivityType =
    | "view"
    | "interview"
    | "shortlisted"
    | "download";

export interface DashboardRecentActivity {
    id: number;
    title: string;
    time: string;
    type: DashboardActivityType;
}

export interface DashboardData {
    stats?: Record<string, DashboardAnalyticsData>;

    analytics?: Record<string, DashboardAnalyticsData>;

    charts?: DashboardCharts;

    profileCompletion?: ProfileCompletionData;

    recentActivity?: DashboardRecentActivity[];

    recentApplications?: JobApplicationWithUser[];

    recentApplicants?: JobApplicationWithUser[];

    jobs?: {
        data: JobWithCompany[];
    };

    applications?: {
        data: JobApplicationWithUser[];
    };

    applicants?: {
        data: JobApplicationWithUser[];
    };

    profileViews?: {
        data: ProfileViewWithViewer[];
    };

    followers?: {
        data: User[];
    };

    following?: {
        data: User[];
    };
}