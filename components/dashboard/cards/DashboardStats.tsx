import { memo } from "react";

import { DashboardAnalyticsData, DashboardStatsProps } from "@/types/dashboard";

import DashboardStatCard from "./DashboardStatCard";
import { DASHBOARD_STATS_CONFIG } from "../config/dashboardStatsConfig";

const DEFAULT_STAT: DashboardAnalyticsData = {
    count: 0,
    growth: 0,
    isPositive: true,
    chartData: [],
};

const DashboardStats = ({ role, stats }: DashboardStatsProps) => {
    const config = DASHBOARD_STATS_CONFIG[role];

    return (
        <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {config.map((item) => {
                const stat = stats?.[item.key] ?? DEFAULT_STAT;

                return (
                    <DashboardStatCard
                        key={item.key}
                        item={item}
                        count={stat.count}
                        growth={stat.growth}
                        isPositive={stat.isPositive}
                        chartData={stat.chartData}
                    />
                );
            })}
        </section>
    );
};

export default memo(DashboardStats);