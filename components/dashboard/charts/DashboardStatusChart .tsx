"use client";

import { useMemo } from "react";

import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
} from "recharts";

import { ChevronDown } from "lucide-react";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

interface StatusItem {
    label: string;

    value: number;

    color: string;
}

interface DashboardStatusChartProps {
    title: string;

    total?: number;

    data: StatusItem[];
}

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

const DashboardStatusChart = ({
    title,
    total,
    data,
}: DashboardStatusChartProps) => {
    // Safe Total
    const calculatedTotal =
        useMemo(() => {
            if (typeof total === "number") {
                return total;
            }

            return data.reduce(
                (acc, item) =>
                    acc + item.value,
                0
            );
        }, [data, total]);

    // Empty State
    const hasData =
        data.length > 0 &&
        calculatedTotal > 0;

    return (
        <div className="h-full rounded-[24px] border border-[#EAEAEA] bg-white p-6">
            {/* Header */}
            <div className="flex items-center justify-between gap-4">
                <h3 className="text-[20px] font-semibold tracking-[-0.3px] text-[#111827]">
                    {title}
                </h3>

                <button className="flex h-11 items-center gap-2 rounded-xl border border-[#E5E7EB] bg-white px-4 text-[14px] font-medium text-[#374151] transition-colors hover:bg-[#F9FAFB]">
                    Last 30 days

                    <ChevronDown
                        className="h-4 w-4"
                        strokeWidth={2}
                    />
                </button>
            </div>

            {/* Content */}
            <div className="mt-8 flex flex-col gap-8 lg:h-[240px] lg:flex-row lg:items-center lg:justify-between">
                {/* Chart */}
                <div className="relative mx-auto h-[220px] w-[220px] flex-shrink-0">
                    {hasData ? (
                        <ResponsiveContainer
                            width="100%"
                            height="100%"
                        >
                            <PieChart>
                                <Tooltip />

                                <Pie
                                    data={data}
                                    dataKey="value"
                                    nameKey="label"
                                    innerRadius={72}
                                    outerRadius={105}
                                    paddingAngle={2}
                                    minAngle={4}
                                    stroke="transparent"
                                    animationDuration={
                                        700
                                    }
                                >
                                    {data.map(
                                        (
                                            item,
                                            index
                                        ) => (
                                            <Cell
                                                key={`${item.label}-${index}`}
                                                fill={
                                                    item.color
                                                }
                                            />
                                        )
                                    )}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex h-full items-center justify-center rounded-full border border-dashed border-slate-200">
                            <p className="text-sm text-slate-400">
                                No chart data
                            </p>
                        </div>
                    )}

                    {/* Center */}
                    <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                        <h4 className="text-[42px] font-bold leading-none tracking-[-2px] text-[#111827]">
                            {calculatedTotal}
                        </h4>

                        <p className="mt-2 text-[16px] font-medium text-[#6B7280]">
                            Total
                        </p>
                    </div>
                </div>

                {/* Legend */}
                <div className="flex flex-1 flex-col gap-5">
                    {hasData ? (
                        data.map((item) => {
                            const percentage =
                                (
                                    (item.value /
                                        calculatedTotal) *
                                    100
                                ).toFixed(1);

                            return (
                                <div
                                    key={
                                        item.label
                                    }
                                    className="flex items-center justify-between gap-4"
                                >
                                    {/* Left */}
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="h-3 w-3 rounded-full"
                                            style={{
                                                backgroundColor:
                                                    item.color,
                                            }}
                                        />

                                        <span className="text-[15px] font-medium text-[#111827]">
                                            {
                                                item.label
                                            }
                                        </span>
                                    </div>

                                    {/* Right */}
                                    <div className="flex items-center gap-2">
                                        <span className="text-[15px] font-semibold text-[#111827]">
                                            {
                                                item.value
                                            }
                                        </span>

                                        <span className="text-[15px] text-[#6B7280]">
                                            (
                                            {
                                                percentage
                                            }
                                            %)
                                        </span>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="flex flex-1 items-center justify-center">
                            <p className="text-sm text-slate-400">
                                No analytics available
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DashboardStatusChart;