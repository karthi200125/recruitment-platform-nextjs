"use client";

import Link from "next/link";
import {
    TrendingDown,
    TrendingUp,
} from "lucide-react";
import {
    Area,
    AreaChart,
    ResponsiveContainer,
} from "recharts";

import type {
    DashboardAnalyticsData,
    DashboardStatItem,
} from "@/types/dashboard";

interface DashboardStatCardProps {
    item: DashboardStatItem;
    value: DashboardAnalyticsData["count"];
    growth: DashboardAnalyticsData["growth"];
    isPositive: DashboardAnalyticsData["isPositive"];
    chartData: DashboardAnalyticsData["chartData"];
}

export default function DashboardStatCard({
    item,
    value,
    growth,
    isPositive,
    chartData,
}: DashboardStatCardProps) {
    const Icon = item.icon;

    const content = (
        <div className="rounded-[20px] border border-[#EAEAEA] bg-white p-5">
            {/* Top */}
            <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                    <div
                        className={`flex h-12 w-12 items-center justify-center rounded-2xl ${item.iconBg}`}
                    >
                        <Icon
                            className={`h-5 w-5 ${item.iconColor}`}
                        />
                    </div>

                    <div>
                        <p className="text-[15px] font-semibold text-[#111827]">
                            {item.label}
                        </p>

                        <h3 className="mt-2 text-[48px] font-bold leading-none tracking-[-2px] text-[#0F172A]">
                            {value}
                        </h3>
                    </div>
                </div>

                {/* Chart */}
                <div className="h-[56px] w-[110px]">
                    <ResponsiveContainer
                        width="100%"
                        height="100%"
                    >
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
                </div>
            </div>

            {/* Bottom */}
            <div className="mt-5 flex items-center gap-1">
                {isPositive ? (
                    <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                ) : (
                    <TrendingDown className="h-3.5 w-3.5 text-red-500" />
                )}

                <span
                    className={`text-[13px] font-semibold ${isPositive
                        ? "text-emerald-500"
                        : "text-red-500"
                        }`}
                >
                    {growth}%
                </span>

                <span className="text-[13px] text-[#6B7280]">
                    vs last 30 days
                </span>
            </div>
        </div>
    );

    if (item.href) {
        return (
            <Link
                href={item.href}
                className="block"
            >
                {content}
            </Link>
        );
    }

    return content;
}