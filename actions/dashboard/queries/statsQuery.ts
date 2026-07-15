import { DashboardAnalyticsData, DashboardStatusChartData } from "@/types/dashboard";

const DAY_MS = 24 * 60 * 60 * 1000;
const WINDOW_DAYS = 30;

interface CountFn {
    (where: Record<string, unknown>): Promise<number>;
}

interface DailyCountFn {
    // returns raw createdAt timestamps within the window, for building the sparkline
    (where: Record<string, unknown>): Promise<Date[]>;
}

// generic rolling-30-day stat builder — works for any model as long as you pass
// a count function and a raw-timestamps function scoped to that model + base filter
export const buildRollingStat = async (
    baseWhere: Record<string, unknown>,
    count: CountFn,
    fetchTimestamps: DailyCountFn
): Promise<DashboardAnalyticsData> => {
    const now = new Date();
    const windowStart = new Date(now.getTime() - WINDOW_DAYS * DAY_MS);
    const previousWindowStart = new Date(now.getTime() - WINDOW_DAYS * 2 * DAY_MS);

    const [currentCount, previousCount, timestamps] = await Promise.all([
        count({ ...baseWhere, createdAt: { gte: windowStart } }),
        count({ ...baseWhere, createdAt: { gte: previousWindowStart, lt: windowStart } }),
        fetchTimestamps({ ...baseWhere, createdAt: { gte: windowStart } }),
    ]);

    const growth = previousCount === 0 ? (currentCount > 0 ? 100 : 0) : Math.round(((currentCount - previousCount) / previousCount) * 100);

    return {
        count: currentCount,
        growth,
        isPositive: currentCount >= previousCount,
        chartData: bucketTimestampsByDay(timestamps, windowStart, now),
    };
};

// buckets raw timestamps into daily counts for the sparkline area chart
export const bucketTimestampsByDay = (timestamps: Date[], start: Date, end: Date): DashboardStatusChartData[] => {
    const buckets = new Map<string, number>();
    const cursor = new Date(start);

    while (cursor <= end) {
        buckets.set(cursor.toISOString().slice(0, 10), 0);
        cursor.setDate(cursor.getDate() + 1);
    }

    for (const ts of timestamps) {
        const key = new Date(ts).toISOString().slice(0, 10);
        buckets.set(key, (buckets.get(key) ?? 0) + 1);
    }

    return Array.from(buckets.entries()).map(([label, value]) => ({ label, value, color: "" }));
};