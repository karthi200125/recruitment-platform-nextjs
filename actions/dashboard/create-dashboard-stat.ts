import { DashboardAnalyticsData } from "@/types/dashboard";
import { calculateGrowth } from "./calculate-growth";

interface CreateDashboardStatProps {
    total: number;
    current: number;
    previous: number;
    chartData?: {
        value: number;
    }[];
}

export const createDashboardStat = ({
    total,
    current,
    previous,
    chartData = [],
}: CreateDashboardStatProps): DashboardAnalyticsData => {
    const { growth, isPositive } = calculateGrowth(
        current,
        previous
    );

    return {
        count: total,
        growth,
        isPositive,
        chartData,
    };
};