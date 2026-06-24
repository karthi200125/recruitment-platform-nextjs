import {
    DashboardStatsProps,
    DashboardAnalyticsData,
} from "@/types/dashboard";
import DashboardStatCard from "./DashboardStatCard";
import { DASHBOARD_STATS_CONFIG } from "../config/dashboardStatsConfig";

const DashboardStats = ({
    role,
    stats,
}: DashboardStatsProps) => {
    const config =
        DASHBOARD_STATS_CONFIG[
        role
        ];

    console.log('dashboard data stats', stats)

    return (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {config.map((item) => {
                const stat = stats[item.key] as DashboardAnalyticsData;
                return (
                    <DashboardStatCard
                        key={item.key}
                        item={item}
                        value={stat?.count ?? 0}
                        growth={stat?.growth ?? 0}
                        isPositive={stat?.isPositive ?? false}
                        chartData={stat?.chartData ?? []}
                    />
                );
            })}
        </div>
    );
};

export default DashboardStats;