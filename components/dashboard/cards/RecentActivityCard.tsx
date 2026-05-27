import Link from "next/link";

import {
    Eye,
    CalendarDays,
    CircleCheckBig,
    Download,
} from "lucide-react";

type ActivityType =
    | "view"
    | "interview"
    | "shortlisted"
    | "download";

type ActivityItem = {
    id: number;
    title: string;
    time: string;
    type: ActivityType;
};

const activities: ActivityItem[] = [
    {
        id: 1,
        title: "Tech Solutions viewed your profile",
        time: "2 hours ago",
        type: "view",
    },

    {
        id: 2,
        title:
            "Interview scheduled for Frontend Developer at Google",
        time: "1 day ago",
        type: "interview",
    },

    {
        id: 3,
        title:
            "You were shortlisted for UI/UX Designer at Microsoft",
        time: "2 days ago",
        type: "shortlisted",
    },

    {
        id: 4,
        title:
            "Your resume was downloaded by Amazon",
        time: "3 days ago",
        type: "download",
    },
];

const activityConfig: Record<
    ActivityType,
    {
        icon: React.ElementType;
        iconClass: string;
        wrapperClass: string;
    }
> = {
    view: {
        icon: Eye,

        iconClass:
            "text-blue-600",

        wrapperClass:
            "bg-blue-50",
    },

    interview: {
        icon: CalendarDays,

        iconClass:
            "text-violet-600",

        wrapperClass:
            "bg-violet-50",
    },

    shortlisted: {
        icon: CircleCheckBig,

        iconClass:
            "text-emerald-600",

        wrapperClass:
            "bg-emerald-50",
    },

    download: {
        icon: Download,

        iconClass:
            "text-orange-500",

        wrapperClass:
            "bg-orange-50",
    },
};

type RecentActivityCardProps = {
    data?: ActivityItem[];
};

export default function RecentActivityCard({
    data = activities,
}: RecentActivityCardProps) {
    return (
        <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            {/* Header */}
            <div className="flex items-center justify-between mb-6">

                <h2 className="text-[20px] font-semibold tracking-tight text-slate-900">
                    Recent Activity
                </h2>

                <Link
                    href="/dashboard/activity"
                    className="text-[14px] font-medium text-blue-600 hover:text-blue-700 transition-colors"
                >
                    View all
                </Link>
            </div>

            {/* Timeline */}
            <div className="flex flex-col">

                {data.map((item, index) => {
                    const config =
                        activityConfig[item.type];

                    const Icon =
                        config.icon;

                    const isLast =
                        index === data.length - 1;

                    return (
                        <div
                            key={item.id}
                            className="relative flex gap-4 pb-7 last:pb-0"
                        >

                            {/* Left timeline */}
                            <div className="relative flex flex-col items-center flex-shrink-0">

                                {/* Line */}
                                {!isLast && (
                                    <div className="absolute top-11 bottom-[-28px] w-px bg-slate-200" />
                                )}

                                {/* Icon */}
                                <div
                                    className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center ${config.wrapperClass}`}
                                >
                                    <Icon
                                        className={`w-[18px] h-[18px] ${config.iconClass}`}
                                        strokeWidth={2}
                                    />
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 pt-1 min-w-0">

                                <p className="text-[16px] leading-[1.5] font-medium text-slate-900">
                                    {item.title}
                                </p>

                                <span className="mt-1 block text-[14px] text-slate-400">
                                    {item.time}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}