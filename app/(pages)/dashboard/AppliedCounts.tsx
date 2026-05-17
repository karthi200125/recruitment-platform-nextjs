"use client";

import {
    BriefcaseBusiness, Bookmark, Clock3, Eye,
    Users, BadgeCheck, Building2, UserCog, ArrowRight, TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { Role } from "@prisma/client";

// ─── Types ────────────────────────────────────────────────────────────────────

interface CandidateCounts {
    applied: number;
    saved: number;
    interviews: number;
    profileViews: number;
}

interface RecruiterCounts {
    postedJobs: number;
    applicants: number;
    shortlisted: number;
    interviews: number;
}

interface OrganizationCounts {
    jobs: number;
    recruiters: number;
    employees: number;
    applicants: number;
}

interface StatItem {
    label: string;
    value: number;
    icon: React.ElementType;
    iconBg: string;
    iconColor: string;
    countColor: string;
    href?: string;
    trend?: string;
}

interface AppliedCountsProps {
    role: Role;
    candidateCounts?: CandidateCounts;
    recruiterCounts?: RecruiterCounts;
    organizationCounts?: OrganizationCounts;
}

// ─── Stats configs ────────────────────────────────────────────────────────────

const getCandidateStats = (counts?: CandidateCounts): StatItem[] => [
    {
        label: "Applied Jobs", value: counts?.applied ?? 0,
        icon: BriefcaseBusiness, href: "/dashboard?tab=applied",
        iconBg: "bg-sky-50", iconColor: "text-sky-600", countColor: "text-sky-700",
    },
    {
        label: "Saved Jobs", value: counts?.saved ?? 0,
        icon: Bookmark, href: "/dashboard?tab=saved",
        iconBg: "bg-violet-50", iconColor: "text-violet-600", countColor: "text-violet-700",
    },
    {
        label: "Interviews", value: counts?.interviews ?? 0,
        icon: Clock3,
        iconBg: "bg-indigo-50", iconColor: "text-indigo-600", countColor: "text-indigo-700",
    },
    {
        label: "Profile Views", value: counts?.profileViews ?? 0,
        icon: Eye, href: "/dashboard?tab=profileViews",
        iconBg: "bg-emerald-50", iconColor: "text-emerald-600", countColor: "text-emerald-700",
        trend: "+12% this week",
    },
];

const getRecruiterStats = (counts?: RecruiterCounts): StatItem[] => [
    {
        label: "Posted Jobs", value: counts?.postedJobs ?? 0,
        icon: BriefcaseBusiness, href: "/dashboard?tab=posted",
        iconBg: "bg-sky-50", iconColor: "text-sky-600", countColor: "text-sky-700",
    },
    {
        label: "Total Applicants", value: counts?.applicants ?? 0,
        icon: Users,
        iconBg: "bg-violet-50", iconColor: "text-violet-600", countColor: "text-violet-700",
    },
    {
        label: "Shortlisted", value: counts?.shortlisted ?? 0,
        icon: BadgeCheck,
        iconBg: "bg-emerald-50", iconColor: "text-emerald-600", countColor: "text-emerald-700",
    },
    {
        label: "Interviews", value: counts?.interviews ?? 0,
        icon: Clock3,
        iconBg: "bg-indigo-50", iconColor: "text-indigo-600", countColor: "text-indigo-700",
    },
];

const getOrganizationStats = (counts?: OrganizationCounts): StatItem[] => [
    {
        label: "Active Jobs", value: counts?.jobs ?? 0,
        icon: Building2, href: "/dashboard/employer/jobs",
        iconBg: "bg-sky-50", iconColor: "text-sky-600", countColor: "text-sky-700",
    },
    {
        label: "Recruiters", value: counts?.recruiters ?? 0,
        icon: UserCog, href: "/dashboard/employees",
        iconBg: "bg-violet-50", iconColor: "text-violet-600", countColor: "text-violet-700",
    },
    {
        label: "Employees", value: counts?.employees ?? 0,
        icon: Users, href: "/dashboard/employees",
        iconBg: "bg-emerald-50", iconColor: "text-emerald-600", countColor: "text-emerald-700",
    },
    {
        label: "Applicants", value: counts?.applicants ?? 0,
        icon: BriefcaseBusiness,
        iconBg: "bg-indigo-50", iconColor: "text-indigo-600", countColor: "text-indigo-700",
    },
];

// ─── Single stat card ─────────────────────────────────────────────────────────

function StatCard({ item }: { item: StatItem }) {
    const Icon = item.icon;

    const inner = (
        <div className="group relative flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden h-full">
            {/* Top hairline */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-100 to-transparent group-hover:via-indigo-200 transition-all duration-300" />

            {/* Icon + trend */}
            <div className="flex items-start justify-between">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${item.iconBg}`}>
                    <Icon className={`w-5 h-5 ${item.iconColor}`} strokeWidth={1.75} />
                </div>
                {item.trend && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-0.5">
                        <TrendingUp className="w-2.5 h-2.5" strokeWidth={2.5} />
                        {item.trend}
                    </span>
                )}
            </div>

            {/* Value + label */}
            <div>
                <p className={`text-3xl font-bold tracking-tight leading-none ${item.countColor}`}>
                    {item.value.toLocaleString()}
                </p>
                <p className="text-xs font-semibold text-slate-600 mt-1">{item.label}</p>
            </div>

            {/* CTA */}
            {item.href && (
                <div className="flex items-center gap-1 text-xs font-semibold text-slate-400 group-hover:text-indigo-600 transition-colors duration-200">
                    View details
                    <ArrowRight className="w-3 h-3 translate-x-0 group-hover:translate-x-0.5 transition-transform duration-200" />
                </div>
            )}
        </div>
    );

    if (item.href) {
        return (
            <Link href={item.href} className="block h-full">
                {inner}
            </Link>
        );
    }

    return inner;
}

// ─── Main component ───────────────────────────────────────────────────────────

const AppliedCounts = ({ role, candidateCounts, recruiterCounts, organizationCounts }: AppliedCountsProps) => {
    const stats =
        role === "CANDIDATE"
            ? getCandidateStats(candidateCounts)
            : role === "RECRUITER"
                ? getRecruiterStats(recruiterCounts)
                : getOrganizationStats(organizationCounts);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {stats.map((item) => (
                <StatCard key={item.label} item={item} />
            ))}
        </div>
    );
};

export default AppliedCounts;