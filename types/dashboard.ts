import { ApplicationStatus, Role } from "@prisma/client";
import { LucideIcon } from "lucide-react";

import { JobApplicationWithUser } from "./application";
import { JobWithCompany } from "./jobs";
import { ProfileViewWithViewer } from "./profile-view";
import { User } from "./user";

export interface DashboardStatusChartData {
    label: string;
    value: number;
    color: string;
}

export type DashboardTab =
    | "overview"
    | "applied"
    | "saved"
    | "interviews"
    | "profileViews"
    | "followers"
    | "following"
    | "postedJobs"
    | "applicants"
    | "jobs"
    | "employees"
    | "hired";

export interface DashboardTabItem {
    label: string;
    value: DashboardTab;
    disabled?: boolean;
    badge?: number;
    href?: string;
}

export interface DashboardActivityChartData {
    name: string;
    value: number;
}

export interface DashboardCharts {
    statusChart: {
        title: string;
        total: number;
        data: DashboardStatusChartData[];
    };
    activityChart: {
        title: string;
        data: DashboardActivityChartData[];
    };
}

export interface DashboardAnalyticsData {
    count: number;
    growth: number;
    isPositive: boolean;
    chartData: DashboardStatusChartData[];
    label?: string;
    description?: string;
}

export type DashboardStatKey =
    | "appliedJobs"
    | "savedJobs"
    | "interviews"
    | "profileViews"
    | "postedJobs"
    | "jobs"
    | "applicants"
    | "employees"
    | "hiredCandidates";

export interface DashboardStatItem {
    key: DashboardStatKey;
    label: string;
    icon: LucideIcon;
    href?: string;
    iconBg: string;
    iconColor: string;
    chartColor: string;
}

// stats is always keyed by DashboardStatKey — components should never widen this to Record<string, ...>
export type DashboardStatsMap = Partial<Record<DashboardStatKey, DashboardAnalyticsData>>;

export interface DashboardStatsProps {
    role: Role;
    stats: DashboardStatsMap;
}

export interface DashboardFilterOption {
    label: string;
    value: string;
}

export interface DashboardFilterItem {
    key: string;
    label: string;
    value: string;
    options: DashboardFilterOption[];
}

export interface DashboardSearchState {
    value: string;
}

export interface DashboardPaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

export interface DashboardPagination<T> {
    data: T[];
    pagination: DashboardPaginationMeta;
}

export interface ProfileCompletionItem {
    label: string;
    completed: boolean;
}

export interface ProfileCompletionData {
    percentage: number;
    items: ProfileCompletionItem[];
    title?: string;
    description?: string;
    actionLabel?: string;
}

export type DashboardActivityType =
    | "APPLICATION"
    | "PROFILE_VIEW"
    | "SHORTLISTED"
    | "UNDER_REVIEW"
    | "INTERVIEW_SCHEDULED"
    | "INTERVIEWED"
    | "HIRED"
    | "REJECTED"
    | "WITHDRAWN"
    | "COMPANY_VERIFIED"
    | "EMPLOYEE_JOINED";

export interface DashboardRecentActivity {
    id: string;
    type: DashboardActivityType;

    title: string;
    description?: string;

    createdAt: Date;

    href?: string;

    user?: {
        id: number;
        name: string;
        image?: string | null;
    };
}


export interface DashboardOverviewData {
    stats: DashboardStatsMap;
    charts: DashboardCharts;
    profileCompletion?: ProfileCompletionData;
    profileViews?: ProfileViewWithViewer[];
    recentApplications?: JobApplicationWithUser[];
    recentActivity: DashboardRecentActivity[];
}

export interface DashboardTableConfig {
    title: string;
    description?: string;
    searchPlaceholder?: string;
    emptyTitle?: string;
    emptyDescription?: string;
    actionLabel?: string;
    filters?: DashboardFilterItem[];
}

export interface DashboardLoadingState {
    isLoading: boolean;
}

export interface DashboardEmptyState {
    title: string;
    description: string;
}

export interface DashboardQueryParams {
    userId: number;
    page?: number;
    limit?: number;
    search?: string;
    status?: ApplicationStatus;
    sort?: "newest" | "oldest";
}

// every role gets both "as candidate" and "as poster" tables since RECRUITER (and any user) can also apply to jobs
export interface CandidateTables {
    appliedJobs: DashboardPagination<JobApplicationWithUser>;
    savedJobs: DashboardPagination<JobWithCompany>;
    interviews: DashboardPagination<JobApplicationWithUser>;
    followers: DashboardPagination<User>;
    following: DashboardPagination<User>;
}

export interface PosterTables {
    postedJobs: DashboardPagination<JobWithCompany>;
    applicants: DashboardPagination<JobApplicationWithUser>;
    hiredCandidates: DashboardPagination<JobApplicationWithUser>;
}

export interface CandidateDashboardData {
    role: "CANDIDATE";
    overview: DashboardOverviewData;
    tables: Partial<CandidateTables>;
}

export interface RecruiterDashboardData {
    role: "RECRUITER";
    overview: DashboardOverviewData;
    tables: Partial<CandidateTables & PosterTables>;
}

export interface OrganizationDashboardData {
    role: "ORGANIZATION";
    overview: DashboardOverviewData;
    tables: Partial<PosterTables & { employees: DashboardPagination<User> }>;
}

export type DashboardData =
    | CandidateDashboardData
    | RecruiterDashboardData
    | OrganizationDashboardData;