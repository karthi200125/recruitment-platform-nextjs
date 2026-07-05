import { Role } from "@prisma/client";
import { LucideIcon } from "lucide-react";

import { JobApplicationWithUser } from "./application";
import { JobWithCompany } from "./jobs";
import { ProfileViewWithViewer } from "./profile-view";
import { User } from "./user";

export interface DashboardChartPoint {
    label?: string;
    value: number;
}

export interface DashboardPagination<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

export interface DashboardAnalyticsData {
    count: number;
    period?: number;
    growth: number;
    isPositive: boolean;
    chartData?: DashboardChartPoint[];
}

export interface DashboardStatusChartData {
    name: string;
    value: number;
}

export interface DashboardActivityChartData {
    name: string;
    value: number;
}

export interface DashboardCharts {
    applicationStatus?: DashboardStatusChartData[];
    applicationActivity?: DashboardActivityChartData[];

    hiringStatus?: DashboardStatusChartData[];
    hiringActivity?: DashboardActivityChartData[];

    organizationHiring?: DashboardStatusChartData[];
    recruiterPerformance?: DashboardActivityChartData[];
}

export interface ProfileCompletionItem {
    label: string;
    completed: boolean;
}

export interface ProfileCompletionData {
    percentage: number;
    items: ProfileCompletionItem[];
}

export type DashboardActivityType =
    | "application"
    | "view"
    | "saved"
    | "shortlisted"
    | "interview"
    | "hired"
    | "rejected"
    | "job"
    | "profile";

export interface DashboardRecentActivity {
    id: number;
    title: string;
    description?: string;
    type: DashboardActivityType;
    createdAt: Date;
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

export interface DashboardPagination<T> {
    data: T[];
    total: number;
    page: number;
    totalPages: number;
}

export interface CandidateDashboardData {
    stats: Record<string, DashboardAnalyticsData>;
    charts?: DashboardCharts;
    profileCompletion: ProfileCompletionData;
    recentActivity: DashboardRecentActivity[];
    recentApplications: JobApplicationWithUser[];
    applications: DashboardPagination<JobApplicationWithUser>;
    savedJobs: DashboardPagination<JobWithCompany>;
    profileViews: DashboardPagination<ProfileViewWithViewer>;
    followers: DashboardPagination<User>;
    following: DashboardPagination<User>;
}

export interface RecruiterDashboardData {
    stats: Record<string, DashboardAnalyticsData>;
    charts?: DashboardCharts;
    recentActivity: DashboardRecentActivity[];
    recentApplicants: JobApplicationWithUser[];
    jobs: DashboardPagination<JobWithCompany>;
    applicants: DashboardPagination<JobApplicationWithUser>;
    hiredCandidates: DashboardPagination<JobApplicationWithUser>;
}

export interface OrganizationDashboardData {
    stats: Record<string, DashboardAnalyticsData>;
    charts?: DashboardCharts;
    recentActivity: DashboardRecentActivity[];
    recentApplicants: JobApplicationWithUser[];
    jobs: DashboardPagination<JobWithCompany>;
    applicants: DashboardPagination<JobApplicationWithUser>;
    hiredCandidates: DashboardPagination<JobApplicationWithUser>;
}

export type DashboardData =
    | CandidateDashboardData
    | RecruiterDashboardData
    | OrganizationDashboardData;