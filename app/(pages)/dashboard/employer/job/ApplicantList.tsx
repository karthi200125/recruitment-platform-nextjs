"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Users, Clock, Eye, Star, XCircle } from "lucide-react";
import ApplicantFilters from "./ApplicantFilters";

export type ApplicationStatus = "APPLIED" | "VIEWED" | "SHORTLISTED" | "REJECTED";

interface User {
    username: string;
    email?: string;
    image?: string | null;
}

interface Application {
    id: number;
    status: ApplicationStatus;
    createdAt: Date | string;
    user: User;
}

interface ApplicantListProps {
    applicants: Application[];
}

export function getStatusConfig(status: string) {
    switch (status) {
        case "APPLIED":
            return { label: "Applied", bg: "bg-slate-100", text: "text-slate-600", border: "border-slate-200", icon: Clock };
        case "VIEWED":
            return { label: "Viewed", bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-200", icon: Eye };
        case "SHORTLISTED":
            return { label: "Shortlisted", bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-200", icon: Star };
        case "REJECTED":
            return { label: "Rejected", bg: "bg-red-50", text: "text-red-500", border: "border-red-200", icon: XCircle };
        default:
            return { label: status, bg: "bg-slate-100", text: "text-slate-500", border: "border-slate-200", icon: Clock };
    }
}

function UserAvatar({ name, image }: { name: string; image?: string | null }) {
    const initials = name.slice(0, 2).toUpperCase();
    if (image) {
        return <img src={image} alt={name} className="w-9 h-9 rounded-full object-cover border border-slate-200 flex-shrink-0" />;
    }
    return (
        <div className="w-9 h-9 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600 flex-shrink-0">
            {initials}
        </div>
    );
}

export function ApplicantListSkeleton() {
    return (
        <div className="divide-y divide-slate-100">
            {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="p-4 flex items-start gap-3 animate-pulse">
                    <div className="w-9 h-9 rounded-full bg-slate-200 flex-shrink-0" />
                    <div className="flex-1 space-y-2 pt-0.5">
                        <div className="h-3.5 w-2/3 rounded-lg bg-slate-200" />
                        <div className="h-3 w-1/2 rounded-lg bg-slate-100" />
                        <div className="h-5 w-20 rounded-full bg-slate-100 mt-1" />
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function ApplicantList({ applicants }: ApplicantListProps) {
    const [filter, setFilter] = useState("ALL");
    const router = useRouter();
    const searchParams = useSearchParams();
    const activeId = searchParams.get("applicantId");

    const counts = applicants.reduce<Record<string, number>>((acc, a) => {
        acc[a.status] = (acc[a.status] ?? 0) + 1;
        return acc;
    }, {});

    const filtered = filter === "ALL" ? applicants : applicants.filter((a) => a.status === filter);

    return (
        <div className="flex flex-col h-full">
            <ApplicantFilters active={filter} setActive={setFilter} counts={counts} />

            {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center flex-1 gap-3 py-16 px-6 text-center">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                        <Users className="w-5 h-5 text-slate-400" strokeWidth={1.75} />
                    </div>
                    <p className="text-sm text-slate-500 font-medium">No candidates found</p>
                    <p className="text-xs text-slate-400">Try changing the filter above.</p>
                </div>
            ) : (
                <div className="divide-y divide-slate-100 overflow-y-auto flex-1">
                    {filtered.map((app, index) => {
                        const isActive = activeId === String(app.id) || (!activeId && index === 0);
                        const config = getStatusConfig(app.status);
                        const StatusIcon = config.icon;

                        return (
                            <div
                                key={app.id}
                                onClick={() => router.push(`?applicantId=${app.id}`)}
                                className={`flex items-start gap-3 p-4 cursor-pointer transition-all duration-200 border-l-[3px] ${
                                    isActive
                                        ? "bg-indigo-50 border-indigo-500"
                                        : "border-transparent hover:bg-slate-50"
                                }`}
                            >
                                <UserAvatar name={app.user.username} image={app.user.image} />
                                <div className="flex-1 min-w-0">
                                    <p className={`text-sm font-semibold truncate ${isActive ? "text-indigo-900" : "text-slate-800"}`}>
                                        {app.user.username}
                                    </p>
                                    {app.user.email && (
                                        <p className="text-xs text-slate-400 truncate mt-0.5">{app.user.email}</p>
                                    )}
                                    <span className={`inline-flex items-center gap-1.5 mt-2 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${config.bg} ${config.text} ${config.border}`}>
                                        <StatusIcon className="w-3 h-3" strokeWidth={2} />
                                        {config.label}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}