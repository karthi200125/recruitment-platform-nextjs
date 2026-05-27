// types/dashboard.ts

import { Role } from "@prisma/client";

export interface DashboardAnalyticsData {
    count: number;

    growth: number;

    isPositive: boolean;

    chartData: {
        value: number;
    }[];
}

export interface DashboardStatItem {
    key: string;

    label: string;

    icon: any;

    href?: string;

    iconBg: string;

    iconColor: string;

    chartColor: string;
}

export interface DashboardStatsProps {
    role: Role;

    stats: Record<
        string,
        DashboardAnalyticsData
    >;
}