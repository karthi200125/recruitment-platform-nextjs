"use client";

import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { ChevronDown } from "lucide-react";
import { DashboardActivityChartData } from "@/types/dashboard";

interface DashboardActivityChartProps {
    title: string;
    data: DashboardActivityChartData[];
    valueLabel?: string;
}

interface CustomTooltipProps {
    active?: boolean;
    payload?: {
        value: number;
    }[];
    label?: string;
}

const CustomTooltip = ({
    active,
    payload,
    label,
    valueLabel,
}: CustomTooltipProps & {
    valueLabel: string;
}) => {
    if (!active || !payload?.length) {
        return null;
    }

    return (
        <div className="rounded-2xl border border-[#EAEAEA] bg-white px-4 py-3 shadow-[0px_8px_30px_rgba(15,23,42,0.08)]">
            <p className="text-[14px] font-medium text-[#6B7280]">
                {label}
            </p>

            <div className="mt-2 flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-[#3B82F6]" />

                <span className="text-[15px] font-semibold text-[#111827]">
                    {payload[0].value.toLocaleString()} {valueLabel}
                </span>
            </div>
        </div>
    );
};

const DashboardActivityChart = ({
    title,
    data,
    valueLabel = "Applications",
}: DashboardActivityChartProps) => {
    const hasData = data.length > 0;

    return (
        <div className="rounded-[24px] border border-[#EAEAEA] bg-white p-6">
            <div className="flex items-center justify-between">
                <h3 className="text-[20px] font-semibold tracking-[-0.3px] text-[#111827]">
                    {title}
                </h3>

                {/* <button
                    type="button"
                    className="flex h-11 items-center gap-2 rounded-xl border border-[#E5E7EB] bg-white px-4 text-[14px] font-medium text-[#374151] transition-colors hover:bg-[#F9FAFB]"
                >
                    Last 30 Days
                    <ChevronDown className="h-4 w-4" strokeWidth={2} />
                </button> */}
            </div>

            <div className="mt-8 h-[250px] w-full">
                {hasData ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} barGap={6}>
                            <CartesianGrid vertical={false} stroke="#F1F5F9" />

                            <XAxis
                                dataKey="name"
                                tickLine={false}
                                axisLine={false}
                                tick={{ fill: "#6B7280", fontSize: 13, fontWeight: 500 }}
                                dy={10}
                            />

                            <YAxis
                                tickLine={false}
                                axisLine={false}
                                tick={{ fill: "#6B7280", fontSize: 13, fontWeight: 500 }}
                                width={40}
                                allowDecimals={false}
                            />

                            <Tooltip cursor={{ fill: "#F8FAFC" }} content={<CustomTooltip valueLabel={valueLabel} />} />
                            
                            <Bar dataKey="value" fill="#3B82F6" radius={[10, 10, 0, 0]} barSize={10} />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-slate-200">
                        <span className="text-sm text-slate-400">No analytics available</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardActivityChart;