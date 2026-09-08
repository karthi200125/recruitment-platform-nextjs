import {
    DashboardAnalyticsData,
    DashboardStatusChartData,
} from "@/types/dashboard";

const DAY_MS = 24 * 60 * 60 * 1000;
const WINDOW_DAYS = 30;

interface DailyCountFn {
    (
        where: Record<string, unknown>
    ): Promise<Date[]>;
}

export const buildRollingStat = async (
    baseWhere: Record<string, unknown>,
    fetchTimestamps: DailyCountFn
): Promise<DashboardAnalyticsData> => {
    const now = new Date();

    const currentWindowStart = new Date(
        now.getTime() - WINDOW_DAYS * DAY_MS
    );

    const previousWindowStart = new Date(
        now.getTime() - WINDOW_DAYS * 2 * DAY_MS
    );

    // IMPORTANT:
    // Only ONE database query.
    //
    // We fetch timestamps for the entire 60-day comparison
    // window and calculate current/previous counts in memory.
    const timestamps = await fetchTimestamps({
        ...baseWhere,
        createdAt: {
            gte: previousWindowStart,
            lt: now,
        },
    });

    let currentCount = 0;
    let previousCount = 0;

    for (const timestamp of timestamps) {
        const time = timestamp.getTime();

        if (time >= currentWindowStart.getTime()) {
            currentCount++;
        } else {
            previousCount++;
        }
    }

    const growth =
        previousCount === 0
            ? currentCount > 0
                ? 100
                : 0
            : Math.round(
                ((currentCount - previousCount) /
                    previousCount) *
                100
            );

    return {
        count: currentCount,
        growth,
        isPositive:
            currentCount >= previousCount,
        chartData: bucketTimestampsByDay(
            timestamps.filter(
                (timestamp) =>
                    timestamp.getTime() >=
                    currentWindowStart.getTime()
            ),
            currentWindowStart,
            now
        ),
    };
};

export const bucketTimestampsByDay = (
    timestamps: Date[],
    start: Date,
    end: Date
): DashboardStatusChartData[] => {
    const buckets = new Map<
        string,
        number
    >();

    const cursor = new Date(start);

    while (cursor <= end) {
        buckets.set(
            cursor.toISOString().slice(0, 10),
            0
        );

        cursor.setDate(
            cursor.getDate() + 1
        );
    }

    for (const timestamp of timestamps) {
        const key = timestamp
            .toISOString()
            .slice(0, 10);

        buckets.set(
            key,
            (buckets.get(key) ?? 0) + 1
        );
    }

    return Array.from(
        buckets,
        ([label, value]) => ({
            label,
            value,
            color: "",
        })
    );
};