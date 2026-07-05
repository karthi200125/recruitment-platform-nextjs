import { subDays } from "date-fns";

interface DashboardDateRanges {
    now: Date;
    currentPeriod: Date;
    previousPeriod: Date;
}

export const getDashboardDateRanges =
    (
        days = 30
    ): DashboardDateRanges => {
        const now = new Date();

        return {
            now,
            currentPeriod: subDays(
                now,
                days
            ),
            previousPeriod: subDays(
                now,
                days * 2
            ),
        };
    };