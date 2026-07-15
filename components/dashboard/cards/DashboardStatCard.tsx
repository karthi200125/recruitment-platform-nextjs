"use client";

import { memo } from "react";
import Link from "next/link";
import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";

import type { DashboardAnalyticsData, DashboardStatItem } from "@/types/dashboard";

interface DashboardStatCardProps {
    item: DashboardStatItem;
    count: DashboardAnalyticsData["count"];
    growth: DashboardAnalyticsData["growth"];
    isPositive: DashboardAnalyticsData["isPositive"];
    chartData: DashboardAnalyticsData["chartData"];
}

const DashboardStatCard = ({ item, count, growth, isPositive, chartData }: DashboardStatCardProps) => {
    const Icon = item.icon;
    const isFlat = growth === 0;
    const magnitude = Math.abs(growth);

    const trendColor = isFlat ? "text-slate-400" : isPositive ? "text-emerald-500" : "text-red-500";

    const content = (
        <article className="rounded-[20px] border border-[#EAEAEA] bg-white p-5 transition-shadow duration-200 hover:shadow-md">
            <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${item.iconBg}`}>
                        <Icon className={`h-5 w-5 ${item.iconColor}`} />
                    </div>

                    <div>
                        <p className="text-[15px] font-semibold text-[#111827]">{item.label}</p>
                        <h2 className="mt-2 text-[48px] font-bold leading-none tracking-[-2px] text-[#0F172A]">
                            {count.toLocaleString()}
                        </h2>
                    </div>
                </div>

                <div className="h-[56px] w-[110px]">
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
                        <div className="flex h-full items-center justify-center text-xs text-slate-400">No data</div>
                    )}
                </div>
            </div>

            <div className="mt-5 flex items-center gap-1">
                {isFlat ? (
                    <Minus className="h-3.5 w-3.5 text-slate-400" />
                ) : isPositive ? (
                    <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                ) : (
                    <TrendingDown className="h-3.5 w-3.5 text-red-500" />
                )}

                <span className={`text-[13px] font-semibold ${trendColor}`}>{magnitude}%</span>
                <span className="text-[13px] text-[#6B7280]">vs last 30 days</span>
            </div>
        </article>
    );

    if (!item.href) {
        return content;
    }

    return (
        <Link href={item.href} className="block" aria-label={`${item.label}: ${count.toLocaleString()}`}>
            {content}
        </Link>
    );
};

export default memo(DashboardStatCard);