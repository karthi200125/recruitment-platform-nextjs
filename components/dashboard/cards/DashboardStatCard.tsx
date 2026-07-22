"use client";

import { memo } from "react";
import Link from "next/link";
import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";

import type {
    DashboardAnalyticsData,
    DashboardStatItem,
} from "@/types/dashboard";

interface DashboardStatCardProps {
    item: DashboardStatItem;
    count: DashboardAnalyticsData["count"];
    growth: DashboardAnalyticsData["growth"];
    isPositive: DashboardAnalyticsData["isPositive"];
    chartData: DashboardAnalyticsData["chartData"];
}

const DashboardStatCard = ({
    item,
    count,
    growth,
    isPositive,
    chartData,
}: DashboardStatCardProps) => {
    const Icon = item.icon;

    const isFlat = growth === 0;
    const magnitude = Math.abs(growth);

    const trendColor = isFlat
        ? "text-slate-400"
        : isPositive
            ? "text-emerald-500"
            : "text-red-500";

    const content = (
        <article className="rounded-2xl border border-slate-200 bg-white p-4 transition-shadow duration-200 hover:shadow-md sm:p-5">
            <div className="flex items-center justify-between gap-3">

                <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">

                    <div
                        className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl sm:h-12 sm:w-12 ${item.iconBg}`}
                    >
                        <Icon
                            className={`h-4 w-4 sm:h-5 sm:w-5 ${item.iconColor}`}
                        />
                    </div>

                    <div className="min-w-0">

                        <p className="truncate text-sm font-semibold text-slate-900 sm:text-[15px]">
                            {item.label}
                        </p>

                        <h2 className="mt-1 text-4xl font-bold leading-none tracking-tight text-slate-900 sm:mt-2 sm:text-5xl">
                            {count.toLocaleString()}
                        </h2>

                    </div>

                </div>

                <div className="h-10 w-16 flex-shrink-0 sm:h-14 sm:w-28">

                    {chartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke={item.chartColor}
                                    strokeWidth={2.5}
                                    fillOpacity={0}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex h-full items-center justify-center text-[10px] text-slate-400 sm:text-xs">
                            No data
                        </div>
                    )}

                </div>

            </div>

            <div className="mt-4 flex items-center gap-1.5 sm:mt-5">

                {isFlat ? (
                    <Minus className="h-3.5 w-3.5 text-slate-400" />
                ) : isPositive ? (
                    <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                ) : (
                    <TrendingDown className="h-3.5 w-3.5 text-red-500" />
                )}

                <span className={`text-xs font-semibold sm:text-[13px] ${trendColor}`}>
                    {magnitude}%
                </span>

                <span className="text-xs text-slate-500 sm:hidden">
                    Last 30d
                </span>

                <span className="hidden text-[13px] text-slate-500 sm:inline">
                    vs last 30 days
                </span>

            </div>

        </article>
    );

    if (!item.href) {
        return content;
    }

    return (
        <Link
            href={item.href}
            className="block"
            aria-label={`${item.label}: ${count.toLocaleString()}`}
        >
            {content}
        </Link>
    );
};

export default memo(DashboardStatCard);