"use client";

import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
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

    total: number;

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
    return (
        <div className="h-full rounded-[24px] border border-[#EAEAEA] bg-white p-6">
            {/* Header */}
            <div className="flex items-center justify-between">
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
            <div className="mt-8 flex h-[240px] flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                {/* Chart */}
                <div className="relative mx-auto h-[220px] w-[220px] flex-shrink-0">
                    <ResponsiveContainer
                        width="100%"
                        height="100%"
                    >
                        <PieChart>
                            <Pie
                                data={data}
                                dataKey="value"
                                innerRadius={72}
                                outerRadius={105}
                                paddingAngle={2}
                                stroke="transparent"
                            >
                                {data.map(
                                    (
                                        item,
                                        index
                                    ) => (
                                        <Cell
                                            key={index}
                                            fill={
                                                item.color
                                            }
                                        />
                                    )
                                )}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>

                    {/* Center */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <h4 className="text-[42px] font-bold leading-none tracking-[-2px] text-[#111827]">
                            {total}
                        </h4>

                        <p className="mt-2 text-[16px] font-medium text-[#6B7280]">
                            Total
                        </p>
                    </div>
                </div>

                {/* Legend */}
                <div className="flex flex-1 flex-col gap-5">
                    {data.map((item) => {
                        const percentage =
                            total > 0
                                ? (
                                    (item.value /
                                        total) *
                                    100
                                ).toFixed(1)
                                : 0;

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
                    })}
                </div>
            </div>
        </div>
    );
};

export default DashboardStatusChart;