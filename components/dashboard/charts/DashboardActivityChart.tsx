"use client";

import {
    BarChart,
    Bar,
    ResponsiveContainer,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
} from "recharts";

import { ChevronDown } from "lucide-react";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

interface ActivityDataItem {
    name: string;

    applications: number;
}

interface DashboardActivityChartProps {
    title: string;

    data: ActivityDataItem[];
}

// ─────────────────────────────────────────────
// Custom Tooltip
// ─────────────────────────────────────────────

interface TooltipProps {
    active?: boolean;

    payload?: any[];

    label?: string;
}

const CustomTooltip = ({
    active,
    payload,
    label,
}: TooltipProps) => {
    if (
        active &&
        payload &&
        payload.length
    ) {
        return (
            <div className="rounded-2xl border border-[#EAEAEA] bg-white px-4 py-3 shadow-[0px_8px_30px_rgba(15,23,42,0.08)]">
                <p className="text-[14px] font-medium text-[#6B7280]">
                    {label}
                </p>

                <div className="mt-2 flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-[#3B82F6]" />

                    <span className="text-[15px] font-semibold text-[#111827]">
                        {
                            payload[0]
                                .value
                        }{" "}
                        Applications
                    </span>
                </div>
            </div>
        );
    }

    return null;
};

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

const DashboardActivityChart = ({
    title,

    data,
}: DashboardActivityChartProps) => {
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

            {/* Chart */}
            <div className="mt-8 h-[250px] w-full">
                <ResponsiveContainer
                    width="100%"
                    height="100%"
                >
                    <BarChart
                        data={data}
                        barGap={6}
                    >
                        {/* Grid */}
                        <CartesianGrid
                            vertical={false}
                            stroke="#F1F5F9"
                        />

                        {/* X Axis */}
                        <XAxis
                            dataKey="name"
                            tickLine={false}
                            axisLine={false}
                            tick={{
                                fill: "#6B7280",
                                fontSize: 13,
                                fontWeight: 500,
                            }}
                            dy={10}
                        />

                        {/* Y Axis */}
                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            tick={{
                                fill: "#6B7280",
                                fontSize: 13,
                                fontWeight: 500,
                            }}
                            width={40}
                        />

                        {/* Tooltip */}
                        <Tooltip
                            cursor={{
                                fill: "transparent",
                            }}
                            content={
                                <CustomTooltip />
                            }
                        />

                        {/* Bars */}
                        <Bar
                            dataKey="applications"
                            radius={[
                                10,
                                10,
                                0,
                                0,
                            ]}
                            fill="#3B82F6"
                            barSize={10}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default DashboardActivityChart;