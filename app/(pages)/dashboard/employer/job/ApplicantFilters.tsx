"use client";

import { Clock, Eye, Star, XCircle, LayoutGrid } from "lucide-react";

const FILTERS = [
    { key: "ALL", label: "All", icon: LayoutGrid, color: "text-slate-600" },
    { key: "APPLIED", label: "Applied", icon: Clock, color: "text-slate-600" },
    { key: "VIEWED", label: "Viewed", icon: Eye, color: "text-blue-600" },
    { key: "SHORTLISTED", label: "Shortlisted", icon: Star, color: "text-emerald-600" },
    { key: "REJECTED", label: "Rejected", icon: XCircle, color: "text-red-500" },
];

interface FiltersProps {
    active: string;
    setActive: (f: string) => void;
    counts: Record<string, number>;
}

export default function ApplicantFilters({ active, setActive, counts }: FiltersProps) {
    return (
        <div className="flex items-center gap-1.5 p-3 border-b border-slate-100 bg-white overflow-x-auto flex-shrink-0">
            {FILTERS.map(({ key, label, icon: Icon }) => {
                const isActive = active === key;
                const count = key === "ALL"
                    ? Object.values(counts).reduce((s, v) => s + v, 0)
                    : (counts[key] ?? 0);

                return (
                    <button
                        key={key}
                        onClick={() => setActive(key)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-200 flex-shrink-0 ${
                            isActive
                                ? "bg-indigo-600 text-white shadow-sm"
                                : "bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700"
                        }`}
                    >
                        <Icon className="w-3 h-3" strokeWidth={2} />
                        {label}
                        {count > 0 && (
                            <span className={`ml-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                                isActive ? "bg-white/20 text-white" : "bg-slate-200 text-slate-500"
                            }`}>
                                {count}
                            </span>
                        )}
                    </button>
                );
            })}
        </div>
    );
}