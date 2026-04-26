"use client";

import Link from "next/link";
import { Users, ListChecks, Briefcase, Bookmark, ArrowRight, TrendingUp } from "lucide-react";
import { Prisma } from "@prisma/client";

type UserWithRelations = Prisma.UserGetPayload<{
    include: {
        postedJobs: true;
        savedJobs: true;
    };
}>;

type JobWithCompany = Prisma.JobGetPayload<{
    include: { company: true };
}>;

type UserRole = "CANDIDATE" | "RECRUITER" | "ORGANIZATION";

interface AppliedCountsProps {
    appliedJobs: JobWithCompany[];
    user: UserWithRelations;
}

const AppliedCounts = ({ appliedJobs, user }: AppliedCountsProps) => {
    const role = user.role as UserRole;

    const cards = [
        {
            id: "profileViews",
            icon: Users,
            label: "Profile Views",
            count: user.ProfileViews?.length ?? 0,
            subtitle: "People who viewed you",
            href: "/dashboard?tab=profileViews",
            iconBg: "bg-indigo-50",
            iconColor: "text-indigo-600",
            countColor: "text-indigo-700",
            trend: "+12% this week",
        },
        ...(role !== "ORGANIZATION" ? [{
            id: "applied",
            icon: ListChecks,
            label: "Applied Jobs",
            count: appliedJobs?.length ?? 0,
            subtitle: "Applications sent",
            href: "/dashboard?tab=applied",
            iconBg: "bg-violet-50",
            iconColor: "text-violet-600",
            countColor: "text-violet-700",
            trend: null,
        }] : []),
        ...(role !== "CANDIDATE" ? [{
            id: "posted",
            icon: Briefcase,
            label: "Posted Jobs",
            count: user.postedJobs?.length ?? 0,
            subtitle: "Active listings",
            href: "/dashboard?tab=posted",
            iconBg: "bg-sky-50",
            iconColor: "text-sky-600",
            countColor: "text-sky-700",
            trend: null,
        }] : []),
        ...(role !== "ORGANIZATION" ? [{
            id: "saved",
            icon: Bookmark,
            label: "Saved Jobs",
            count: user.savedJobs?.length ?? 0,
            subtitle: "Bookmarked roles",
            href: "/dashboard?tab=saved",
            iconBg: "bg-emerald-50",
            iconColor: "text-emerald-600",
            countColor: "text-emerald-700",
            trend: null,
        }] : []),
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {cards.map((card) => {
                const Icon = card.icon;
                return (
                    <Link
                        key={card.id}
                        href={card.href}
                        className="group relative flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden"
                    >
                        {/* Top hairline */}
                        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-100 to-transparent group-hover:via-indigo-200 transition-all duration-300" />

                        {/* Icon + label */}
                        <div className="flex items-center justify-between">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.iconBg} flex-shrink-0`}>
                                <Icon className={`w-5 h-5 ${card.iconColor}`} strokeWidth={1.75} />
                            </div>
                            {card.trend && (
                                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-0.5">
                                    <TrendingUp className="w-2.5 h-2.5" strokeWidth={2.5} />
                                    {card.trend}
                                </span>
                            )}
                        </div>

                        {/* Count + subtitle */}
                        <div>
                            <p className={`text-3xl font-bold tracking-tight ${card.countColor}`}>{card.count}</p>
                            <p className="text-xs font-semibold text-slate-700 mt-0.5">{card.label}</p>
                            <p className="text-[11px] text-slate-400 mt-0.5">{card.subtitle}</p>
                        </div>

                        {/* CTA */}
                        <div className="flex items-center gap-1 text-xs font-semibold text-slate-400 group-hover:text-indigo-600 transition-colors duration-200">
                            View details
                            <ArrowRight className="w-3 h-3 translate-x-0 group-hover:translate-x-0.5 transition-transform duration-200" />
                        </div>
                    </Link>
                );
            })}
        </div>
    );
};

export default AppliedCounts;