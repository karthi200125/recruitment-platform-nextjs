import { format } from "date-fns";

import {
    DashboardActivityChartData,
    DashboardRecentActivity,
} from "@/types/dashboard";

export const buildActivityChartData = (
    activities: DashboardRecentActivity[],
    days = 7
): DashboardActivityChartData[] => {
    const counts = new Map<string, number>();

    for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);

        const key = format(date, "MMM d");

        counts.set(key, 0);
    }

    activities.forEach((activity) => {
        const key = format(activity.createdAt, "MMM d");

        if (counts.has(key)) {
            counts.set(key, (counts.get(key) ?? 0) + 1);
        }
    });

    return Array.from(counts.entries()).map(([name, value]) => ({
        name,
        value,
    }));
};