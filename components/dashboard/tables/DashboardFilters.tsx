"use client";

import { Filter } from "lucide-react";

export interface DashboardFilterOption {
    label: string;
    value: string;
}

export interface DashboardFilterItem {
    key: string;
    label: string;
    value: string;
    options: DashboardFilterOption[];
}

interface DashboardFiltersProps {
    filters: DashboardFilterItem[];
    onChange: (
        key: string,
        value: string
    ) => void;
    className?: string;
}

const DashboardFilters = ({
    filters,
    onChange,
    className,
}: DashboardFiltersProps) => {
    if (filters.length === 0) {
        return null;
    }

    return (
        <div
            className={`flex flex-wrap items-center gap-3 ${className ?? ""}`}
        >
            {filters.map((filter) => (
                <div
                    key={filter.key}
                    className="relative"
                >
                    <Filter
                        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                    />

                    <select
                        value={filter.value}
                        onChange={(e) =>
                            onChange(
                                filter.key,
                                e.target.value
                            )
                        }
                        className="h-11 min-w-[180px] appearance-none rounded-xl border border-slate-200 bg-white pl-10 pr-10 text-[14px] font-medium text-slate-700 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    >
                        <option value="">
                            All {filter.label}
                        </option>

                        {filter.options.map(
                            (option) => (
                                <option
                                    key={option.value}
                                    value={
                                        option.value
                                    }
                                >
                                    {option.label}
                                </option>
                            )
                        )}
                    </select>

                    <svg
                        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                            clipRule="evenodd"
                        />
                    </svg>
                </div>
            ))}
        </div>
    );
};

export default DashboardFilters;