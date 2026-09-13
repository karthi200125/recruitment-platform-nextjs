import {
    DashboardAnalyticsData,
    DashboardStatusChartData,
} from "@/types/dashboard";

const DAY_MS = 24 * 60 * 60 * 1000;
const WINDOW_DAYS = 30;

const CURRENT_WINDOW_DAYS = WINDOW_DAYS;
const TOTAL_WINDOW_DAYS = WINDOW_DAYS * 2;

interface DailyCountFn {
    (
        where: Record<string, unknown>
    ): Promise<Date[]>;
}

/**
 * Builds a rolling 30-day statistic.
 *
 * Performance characteristics:
 * - 1 database query per statistic
 * - Only createdAt is fetched
 * - Current + previous counts calculated in one pass
 * - Current chart data calculated without another DB query
 *
 * The caller is responsible for providing a query that selects
 * only the required createdAt field.
 */
export const buildRollingStat = async (
    baseWhere: Record<string, unknown>,
    fetchTimestamps: DailyCountFn
): Promise<DashboardAnalyticsData> => {
    const now = new Date();

    const currentWindowStart = new Date(
        now.getTime() -
            CURRENT_WINDOW_DAYS * DAY_MS
    );

    const previousWindowStart = new Date(
        now.getTime() -
            TOTAL_WINDOW_DAYS * DAY_MS
    );

    const currentWindowStartMs =
        currentWindowStart.getTime();

    const nowMs = now.getTime();

    /**
     * Fetch only the timestamps required for:
     *
     * previous 30 days
     * +
     * current 30 days
     *
     * No unnecessary columns are retrieved.
     */
    const timestamps = await fetchTimestamps({
        ...baseWhere,
        createdAt: {
            gte: previousWindowStart,
            lt: now,
        },
    });

    let currentCount = 0;
    let previousCount = 0;

    /**
     * Only one iteration over the returned records.
     */
    for (const timestamp of timestamps) {
        const time = timestamp.getTime();

        if (
            time >= currentWindowStartMs &&
            time < nowMs
        ) {
            currentCount++;
        } else if (
            time >= previousWindowStart.getTime() &&
            time < currentWindowStartMs
        ) {
            previousCount++;
        }
    }

    const growth =
        previousCount === 0
            ? currentCount > 0
                ? 100
                : 0
            : Math.round(
                  ((currentCount -
                      previousCount) /
                      previousCount) *
                      100
              );

    /**
     * Build chart data from current-period
     * timestamps only.
     */
    const chartTimestamps: Date[] = [];

    for (const timestamp of timestamps) {
        if (
            timestamp.getTime() >=
                currentWindowStartMs &&
            timestamp.getTime() < nowMs
        ) {
            chartTimestamps.push(timestamp);
        }
    }

    return {
        count: currentCount,
        growth,
        isPositive:
            currentCount >= previousCount,
        chartData: bucketTimestampsByDay(
            chartTimestamps,
            currentWindowStart,
            now
        ),
    };
};

/**
 * Converts timestamps into daily chart buckets.
 *
 * Always returns a complete 30-day range,
 * including days with zero activity.
 */
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

    /**
     * Pre-create every day so the chart does not
     * have missing dates.
     */
    while (cursor <= end) {
        buckets.set(
            cursor.toISOString().slice(0, 10),
            0
        );

        cursor.setDate(
            cursor.getDate() + 1
        );
    }

    /**
     * Add activity to the appropriate day.
     */
    for (const timestamp of timestamps) {
        const key = timestamp
            .toISOString()
            .slice(0, 10);

        const existing =
            buckets.get(key) ?? 0;

        buckets.set(
            key,
            existing + 1
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