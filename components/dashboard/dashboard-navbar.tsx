"use client";


import {
    Search,
    SlidersHorizontal,
} from "lucide-react";

import { Role } from "@prisma/client";

import {
    usePathname,
    useRouter,
    useSearchParams,
} from "next/navigation";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

import { DASHBOARD_TABS } from "./config/dashboardTabsConfig";
import { DASHBOARD_FILTERS } from "./config/dashboardFiltersConfig";


interface DashboardNavbarProps {
    role: Role;

    activeTab: string;
}

const DashboardNavbar = ({
    role,
    activeTab,
}: DashboardNavbarProps) => {
    const router = useRouter();

    const pathname = usePathname();

    const searchParams =
        useSearchParams();

    const tabs =
        DASHBOARD_TABS[role];

    const currentConfig =
        DASHBOARD_FILTERS[
        activeTab
        ];

    const isOverview =
        activeTab === "overview";

    const updateParams = (
        key: string,
        value: string
    ) => {
        const params =
            new URLSearchParams(
                searchParams.toString()
            );

        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }

        router.push(
            `${pathname}?${params.toString()}`
        );
    };

    return (
        <div className="flex flex-col gap-4">
            {/* Top */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                {/* Tabs */}
                <div className="scrollbar-hide flex items-center gap-2 overflow-x-auto">
                    {tabs.map((tab) => {
                        const isActive =
                            activeTab ===
                            tab.value;

                        return (
                            <button
                                key={tab.value}
                                onClick={() =>
                                    updateParams(
                                        "tab",
                                        tab.value
                                    )
                                }
                                className={`whitespace-nowrap rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 ${isActive
                                    ? "bg-emerald-50 text-emerald-600"
                                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                                    }`}
                            >
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* Search + Filters */}
                {!isOverview &&
                    currentConfig && (
                        <div className="flex items-center gap-2">
                            {/* Search */}
                            <div className="flex h-11 w-full items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 lg:w-[320px]">
                                <Search className="h-4 w-4 text-slate-400" />

                                <input
                                    type="text"
                                    placeholder={
                                        currentConfig.placeholder
                                    }
                                    defaultValue={
                                        searchParams.get(
                                            "search"
                                        ) || ""
                                    }
                                    onChange={(
                                        e
                                    ) =>
                                        updateParams(
                                            "search",
                                            e
                                                .target
                                                .value
                                        )
                                    }
                                    className="h-full w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                                />
                            </div>

                            {/* Filters */}
                            <Popover>
                                <PopoverTrigger asChild>
                                    <button className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white transition hover:bg-slate-50">
                                        <SlidersHorizontal className="h-4 w-4 text-slate-600" />
                                    </button>
                                </PopoverTrigger>

                                <PopoverContent
                                    align="end"
                                    className="w-72 rounded-2xl border border-slate-200 p-4"
                                >
                                    <div className="space-y-5">
                                        {currentConfig.filters.map(
                                            (
                                                filter
                                            ) => {
                                                const Icon =
                                                    filter.icon;

                                                return (
                                                    <div
                                                        key={
                                                            filter.key
                                                        }
                                                        className="space-y-2"
                                                    >
                                                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                                                            <Icon className="h-4 w-4" />

                                                            {
                                                                filter.label
                                                            }
                                                        </div>

                                                        <div className="flex flex-wrap gap-2">
                                                            {filter.options.map(
                                                                (
                                                                    option
                                                                ) => {
                                                                    const active =
                                                                        searchParams.get(
                                                                            filter.key
                                                                        ) ===
                                                                        option.value;

                                                                    return (
                                                                        <button
                                                                            key={
                                                                                option.value
                                                                            }
                                                                            onClick={() =>
                                                                                updateParams(
                                                                                    filter.key,
                                                                                    option.value
                                                                                )
                                                                            }
                                                                            className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${active
                                                                                ? "border-emerald-200 bg-emerald-50 text-emerald-600"
                                                                                : "border-slate-200 text-slate-600 hover:bg-slate-100"
                                                                                }`}
                                                                        >
                                                                            {
                                                                                option.label
                                                                            }
                                                                        </button>
                                                                    );
                                                                }
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            }
                                        )}
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>
                    )}
            </div>
        </div>
    );
};

export default DashboardNavbar;