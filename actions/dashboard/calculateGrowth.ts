interface GrowthResult {
    growth: number;
    isPositive: boolean;
}

export function calculateGrowth(
    current: number,
    previous: number
): GrowthResult {    
    if (previous === 0) {
        return {
            growth:
                current > 0 ? 100 : 0,

            isPositive:
                current >= 0,
        };
    }

    const growth =
        ((current - previous) /
            previous) *
        100;

    return {
        growth: Number(
            growth.toFixed(1)
        ),

        isPositive: growth >= 0,
    };
}