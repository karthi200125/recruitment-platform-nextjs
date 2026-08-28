"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { ChevronDown } from "lucide-react";

interface StatusItem {
    label: string;
    value: number;
    color: string;
}

interface ApplicationStatusChartProps {
    data: StatusItem[];
    total: number;
    title?: string
}

const PERIODS = [
    { label: "Today", value: "1" },
    { label: "7 Days", value: "7" },
    { label: "30 Days", value: "30" },
    { label: "90 Days", value: "90" },
    { label: "All Time", value: "all" },
] as const;

const CustomLegend = ({
    data,
    total,
}: {
    data: StatusItem[];
    total: number;
}) => (
    <ul className="w-full space-y-1.5">
        {data.map((item) => (
            <li
                key={item.label}
                className="flex items-center justify-between gap-3 text-xs"
            >
                <div className="flex min-w-0 items-center gap-2">
                    <span
                        className="h-2.5 w-2.5 flex-shrink-0 rounded-full"
                        style={{ backgroundColor: item.color }}
                    />

                    <span className="truncate capitalize text-slate-600">
                        {item.label.replace(/_/g, " ")}
                    </span>
                </div>

                <div className="flex flex-shrink-0 items-center gap-2">
                    <span className="font-semibold text-slate-800">
                        {item.value.toLocaleString()}
                    </span>

                    <span className="w-12 text-right text-slate-400">
                        (
                        {total > 0
                            ? ((item.value / total) * 100).toFixed(0)
                            : 0}
                        %)
                    </span>
                </div>
            </li>
        ))}
    </ul>
);

interface CustomTooltipProps {
    active?: boolean;
    payload?: Array<{
        payload: StatusItem;
    }>;
}

const CustomTooltip = ({
    active,
    payload,
}: CustomTooltipProps) => {
    if (!active || !payload || payload.length === 0) {
        return null;
    }

    const item = payload[0]?.payload;

    if (!item) {
        return null;
    }

    return (
        <div className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 shadow-lg">
            {/* Status name */}
            <div className="flex items-center gap-2">
                <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{
                        backgroundColor: item.color,
                    }}
                />

                <p className="text-xs font-semibold capitalize text-slate-800">
                    {item.label.replace(/_/g, " ")}
                </p>
            </div>

            {/* Count */}
            <p className="mt-1 text-xs text-slate-500">
                {item.value.toLocaleString()}{" "}
                {item.value === 1 ? "application" : "applications"}
            </p>
        </div>
    );
};

export default function ApplicationStatusChart({
    title,
    data,
    total,
}: ApplicationStatusChartProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const currentPeriod = searchParams.get("days") ?? "30";

    const currentLabel =
        PERIODS.find((period) => period.value === currentPeriod)
            ?.label ?? "30 Days";

    const handlePeriodChange = (value: string) => {
        startTransition(() => {
            const params = new URLSearchParams(
                searchParams.toString()
            );

            if (value === "all") {
                params.delete("days");
            } else {
                params.set("days", value);
            }

            const queryString = params.toString();

            router.push(
                queryString ? `?${queryString}` : "?"
            );
        });
    };

    const isEmpty = data.length === 0 || total === 0;

    return (
        <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4">
                <h2 className="text-[20px] font-semibold tracking-tight text-slate-900">
                    {title || "Application Status"}
                </h2>

                {/* Period dropdown */}
                <div className="relative">
                    <select
                        value={currentPeriod}
                        onChange={(event) =>
                            handlePeriodChange(event.target.value)
                        }
                        disabled={isPending}
                        className="cursor-pointer appearance-none rounded-xl border border-slate-200 bg-slate-50 py-1.5 pl-3 pr-8 text-xs font-semibold text-slate-700 outline-none transition-all duration-200 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/30 disabled:opacity-50"
                    >
                        {PERIODS.map((period) => (
                            <option
                                key={period.value}
                                value={period.value}
                            >
                                {period.label}
                            </option>
                        ))}
                    </select>

                    <ChevronDown
                        className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400"
                        strokeWidth={2}
                    />
                </div>
            </div>

            {/* Body */}
            <div className="p-5">
                {isEmpty ? (
                    <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100">
                            <span className="text-xl">
                                📊
                            </span>
                        </div>

                        <p className="text-sm font-medium text-slate-500">
                            No applications yet
                        </p>

                        <p className="text-xs text-slate-400">
                            Start applying to see your status
                            breakdown.
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-5">

                        {/* Pie Chart */}
                        <div
                            className="relative w-full"
                            style={{ height: 160 }}
                        >
                            <ResponsiveContainer
                                width="100%"
                                height="100%"
                            >
                                <PieChart
                                    margin={{
                                        top: 0,
                                        right: 0,
                                        bottom: 0,
                                        left: 0,
                                    }}
                                >
                                    <Pie
                                        data={data}
                                        dataKey="value"
                                        nameKey="label"
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={45}
                                        outerRadius={72}
                                        paddingAngle={2}
                                        stroke="transparent"
                                        strokeWidth={0}
                                    >
                                        {data.map((item) => (
                                            <Cell
                                                key={item.label}
                                                fill={item.color}
                                            />
                                        ))}
                                    </Pie>

                                    <Tooltip
                                        content={
                                            <CustomTooltip />
                                        }
                                    />
                                </PieChart>
                            </ResponsiveContainer>

                            {/* Center */}
                            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                                <p className="text-2xl font-bold leading-none text-slate-900">
                                    {total.toLocaleString()}
                                </p>

                                <p className="mt-0.5 text-[10px] font-medium text-slate-400">
                                    Total
                                </p>
                            </div>
                        </div>

                        {/* Legend */}
                        <CustomLegend
                            data={data}
                            total={total}
                        />
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="px-5 pb-4">
                <p className="text-[11px] text-slate-400">
                    Showing data for:{" "}
                    <span className="font-semibold text-slate-600">
                        {currentLabel}
                    </span>
                </p>
            </div>
        </div>
    );
}