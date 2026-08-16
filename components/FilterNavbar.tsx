"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronDown, Search, X, Zap } from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
    DatePosted,
    experiences,
    getStates,
    JobMode,
} from "@/lib/getOptionsData";
import { useQuery } from "@tanstack/react-query";

interface Filter {
    id: number;
    title: string;
    options: string[];
    searchable?: boolean;
}

interface FilterNavbarProps {
    companynames: string[];
}

const FilterNavbar = ({ companynames }: FilterNavbarProps) => {
    const router = useRouter();

    const { data: states = [] } = useQuery({
        queryKey: ["getStates"],
        queryFn: getStates,
    });

    const locations = useMemo(
        () => states.map((state: any) => state.name),
        [states]
    );

    const filters: Filter[] = useMemo(
        () => [
            {
                id: 1,
                title: "Date Posted",
                options: DatePosted,
            },
            {
                id: 2,
                title: "Experience",
                options: experiences,
            },
            {
                id: 3,
                title: "Type",
                options: JobMode,
            },
            {
                id: 4,
                title: "Location",
                options: locations,
                searchable: true,
            },
            {
                id: 5,
                title: "Company",
                options: companynames,
                searchable: true,
            },
        ],
        [locations, companynames]
    );

    const defaultFilters = useMemo(
        () =>
            filters.reduce(
                (acc, filter) => {
                    acc[filter.title] = "";
                    return acc;
                },
                {} as Record<string, string>
            ),
        [filters]
    );

    const [selectedFilters, setSelectedFilters] =
        useState<Record<string, string>>(defaultFilters);

    const [easyApply, setEasyApply] = useState(false);

    // Which dropdown is currently open
    const [openFilter, setOpenFilter] = useState<number | null>(null);

    // Search text for Location / Company dropdowns
    const [searchTerms, setSearchTerms] = useState<Record<string, string>>({});

    const updateUrlParams = useCallback(
        (filters: Record<string, string>, easy: boolean) => {
            const params = new URLSearchParams();

            Object.entries(filters).forEach(([key, value]) => {
                if (value) {
                    params.set(
                        key.toLowerCase().replace(/ /g, ""),
                        value
                    );
                }
            });

            if (easy) {
                params.set("easyApply", "true");
            }

            const queryString = params.toString();

            router.push(queryString ? `/jobs?${queryString}` : "/jobs");
        },
        [router]
    );

    const handleOptionSelect = useCallback(
        (title: string, option: string) => {
            setSelectedFilters((prev) => {
                const next = {
                    ...prev,
                    [title]: prev[title] === option ? "" : option,
                };

                updateUrlParams(next, easyApply);

                return next;
            });

            // Close dropdown after selection
            setOpenFilter(null);

            // Clear search text
            setSearchTerms((prev) => ({
                ...prev,
                [title]: "",
            }));
        },
        [easyApply, updateUrlParams]
    );

    const handleDropdownOpen = useCallback(
        (filterId: number, open: boolean) => {
            setOpenFilter(open ? filterId : null);

            if (!open) {
                const filter = filters.find((item) => item.id === filterId);

                if (filter) {
                    setSearchTerms((prev) => ({
                        ...prev,
                        [filter.title]: "",
                    }));
                }
            }
        },
        [filters]
    );

    const handleSearch = useCallback(
        (title: string, value: string) => {
            setSearchTerms((prev) => ({
                ...prev,
                [title]: value,
            }));
        },
        []
    );

    const getFilteredOptions = useCallback(
        (filter: Filter) => {
            if (!filter.searchable) {
                return filter.options;
            }

            const search = (searchTerms[filter.title] || "")
                .trim()
                .toLowerCase();

            if (!search) {
                return filter.options;
            }

            return filter.options.filter((option) =>
                option.toLowerCase().includes(search)
            );
        },
        [searchTerms]
    );

    const resetAll = useCallback(() => {
        setSelectedFilters(defaultFilters);
        setEasyApply(false);
        setSearchTerms({});
        setOpenFilter(null);

        router.push("/jobs");
    }, [defaultFilters, router]);

    const handleEasyApply = useCallback(() => {
        const next = !easyApply;

        setEasyApply(next);
        updateUrlParams(selectedFilters, next);
    }, [easyApply, selectedFilters, updateUrlParams]);

    const activeCount =
        Object.values(selectedFilters).filter(Boolean).length +
        (easyApply ? 1 : 0);

    return (
        <div className="w-full bg-white border-b border-slate-100 py-2.5 flex items-center gap-2 overflow-x-auto">
            {/* Filter pills */}
            {filters.map((filter) => {
                const active = selectedFilters[filter.title];
                const isActive = !!active;

                const filteredOptions = getFilteredOptions(filter);
                const searchValue = searchTerms[filter.title] || "";

                return (
                    <DropdownMenu
                        key={filter.id}
                        open={openFilter === filter.id}
                        onOpenChange={(open) =>
                            handleDropdownOpen(filter.id, open)
                        }
                    >
                        <DropdownMenuTrigger asChild>
                            <button
                                type="button"
                                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-semibold whitespace-nowrap transition-all duration-200 outline-none flex-shrink-0 ${isActive
                                    ? "bg-indigo-50 border-indigo-400 text-indigo-700"
                                    : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-800"
                                    }`}
                            >
                                {isActive && (
                                    <Check
                                        className="w-3 h-3"
                                        strokeWidth={2.5}
                                    />
                                )}

                                {active || filter.title}

                                <ChevronDown
                                    className="w-3 h-3 opacity-60"
                                    strokeWidth={2.5}
                                />
                            </button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent
                            align="start"
                            className="w-[280px] rounded-2xl border border-slate-200 bg-white shadow-lg p-0 overflow-hidden"
                            sideOffset={6}
                        >
                            {/* Header */}
                            <div className="px-4 py-3 border-b border-slate-100">
                                <p className="text-xs font-bold text-slate-800">
                                    {filter.title}
                                </p>

                                {isActive && (
                                    <p className="text-[11px] text-indigo-600 mt-0.5">
                                        Selected: {active}
                                    </p>
                                )}
                            </div>

                            {/* Search — only Location & Company */}
                            {filter.searchable && (
                                <div className="px-3 py-2 border-b border-slate-100">
                                    <div className="relative">
                                        <Search
                                            className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400"
                                            strokeWidth={2}
                                        />

                                        <input
                                            type="text"
                                            value={searchValue}
                                            onChange={(event) =>
                                                handleSearch(
                                                    filter.title,
                                                    event.target.value
                                                )
                                            }
                                            onKeyDown={(event) =>
                                                event.stopPropagation()
                                            }
                                            placeholder={`Search ${filter.title.toLowerCase()}...`}
                                            className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-xs text-slate-700 placeholder:text-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Options */}
                            <ul className="max-h-60 overflow-y-auto py-1">
                                {filteredOptions.length > 0 ? (
                                    filteredOptions.map((option) => {
                                        const isSelected =
                                            active === option;

                                        return (
                                            <li
                                                key={option}
                                                onClick={() =>
                                                    handleOptionSelect(
                                                        filter.title,
                                                        option
                                                    )
                                                }
                                                className={`flex items-center justify-between gap-3 px-4 py-2.5 cursor-pointer transition-colors duration-150 ${isSelected
                                                    ? "bg-indigo-50"
                                                    : "hover:bg-indigo-50"
                                                    }`}
                                            >
                                                <span
                                                    className={`text-sm capitalize ${isSelected
                                                        ? "text-indigo-700 font-semibold"
                                                        : "text-slate-700"
                                                        }`}
                                                >
                                                    {option}
                                                </span>

                                                {isSelected && (
                                                    <div className="w-4 h-4 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0">
                                                        <Check
                                                            className="w-2.5 h-2.5 text-white"
                                                            strokeWidth={3}
                                                        />
                                                    </div>
                                                )}
                                            </li>
                                        );
                                    })
                                ) : (
                                    <li className="px-4 py-8 text-center text-xs text-slate-400">
                                        No {filter.title.toLowerCase()} found
                                    </li>
                                )}
                            </ul>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            })}

            {/* Easy Apply */}
            <button
                type="button"
                onClick={handleEasyApply}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-semibold whitespace-nowrap transition-all duration-200 flex-shrink-0 ${easyApply
                    ? "bg-indigo-600 border-indigo-600 text-white"
                    : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-800"
                    }`}
            >
                <Zap
                    className={`w-3 h-3 ${easyApply
                        ? "text-white"
                        : "text-slate-400"
                        }`}
                    strokeWidth={2.5}
                />

                Easy Apply
            </button>

            {/* Reset */}
            {activeCount > 0 && (
                <button
                    type="button"
                    onClick={resetAll}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-red-500 hover:bg-red-50 transition-all duration-200 flex-shrink-0 whitespace-nowrap"
                >
                    <X
                        className="w-3 h-3"
                        strokeWidth={2.5}
                    />

                    Reset
                    {activeCount > 1 ? ` (${activeCount})` : ""}
                </button>
            )}
        </div>
    );
};

export default FilterNavbar;