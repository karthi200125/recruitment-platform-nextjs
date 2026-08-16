"use client";

import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

import { getActivityConfig } from "@/lib/dashboard/activity-config";
import { DashboardRecentActivity } from "@/types/dashboard";

interface RecentActivityCardProps {
    activities: DashboardRecentActivity[];
}

const RecentActivityCard = ({
    activities,
}: RecentActivityCardProps) => {
    // Show only the latest 5 activities in this card.
    // This does not modify the original activities array.
    const recentActivities = activities.slice(0, 5);

    if (recentActivities.length === 0) {
        return (
            <div className="flex h-full min-h-[360px] flex-col rounded-2xl border border-slate-200 bg-white shadow-sm">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
                    <h2 className="text-[20px] font-semibold tracking-tight text-slate-900">
                        Recent Activity
                    </h2>

                    <Link
                        href="/dashboard?tab=activity"
                        className="text-[14px] font-medium text-blue-600 transition-colors hover:text-blue-700"
                    >
                        View all
                    </Link>
                </div>

                {/* Empty State */}
                <div className="flex flex-1 items-center justify-center">
                    <p className="text-[15px] text-slate-500">
                        No recent activity found.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-[20px] font-semibold tracking-tight text-slate-900">
                    Recent Activity
                </h2>

                <Link
                    href="/dashboard?tab=activity"
                    className="text-[14px] font-medium text-blue-600 transition-colors hover:text-blue-700"
                >
                    View all
                </Link>
            </div>

            {/* Timeline */}
            <div className="flex flex-col">
                {recentActivities.map((activity, index) => {
                    const config = getActivityConfig(activity.type);
                    const Icon = config.icon;

                    const isLast =
                        index === recentActivities.length - 1;

                    return (
                        <div
                            key={activity.id}
                            className="relative flex gap-4 pb-7 last:pb-0"
                        >
                            {/* Timeline */}
                            <div className="relative flex flex-shrink-0 flex-col items-center">
                                {!isLast && (
                                    <div className="absolute bottom-[-28px] top-11 w-px bg-slate-200" />
                                )}

                                <div
                                    className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full ${config.wrapperClass}`}
                                >
                                    <Icon
                                        className={`h-[18px] w-[18px] ${config.iconClass}`}
                                        strokeWidth={2}
                                    />
                                </div>
                            </div>

                            {/* Content */}
                            <div className="min-w-0 flex-1 pt-1">
                                <p className="text-[15px] font-medium leading-6 text-slate-900">
                                    {activity.title}
                                </p>

                                <span className="mt-1 block text-[13px] text-slate-400">
                                    {formatDistanceToNow(
                                        activity.createdAt,
                                        {
                                            addSuffix: true,
                                        }
                                    )}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default RecentActivityCard;