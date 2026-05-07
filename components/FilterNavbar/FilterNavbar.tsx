'use client';

import { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { ChevronDown, Zap, X, Check } from 'lucide-react';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { DatePosted, experiences, getStates, JobMode } from '@/getOptionsData';
import { getCompanies } from '@/actions/company/getCompanies';

interface Filter {
    id: number;
    title: string;
    options: string[];
}

const FilterNavbar = () => {
    const router = useRouter();

    const { data: states = [] } = useQuery({ queryKey: ['getStates'], queryFn: getStates });
    const { data: companiesData = [] } = useQuery({ queryKey: ['getCompanies'], queryFn: getCompanies });

    const locations = useMemo(() => states.map((s: any) => s.name), [states]);
    const companiesOptions = useMemo(() => companiesData.map((c: any) => c.companyName), [companiesData]);

    const filters: Filter[] = useMemo(() => [
        { id: 1, title: "Date Posted", options: DatePosted },
        { id: 2, title: "Experience", options: experiences },
        { id: 3, title: "Type", options: JobMode },
        { id: 4, title: "Location", options: locations },
        { id: 5, title: "Company", options: companiesOptions },
    ], [locations, companiesOptions]);

    const defaultFilters = useMemo(
        () => filters.reduce((acc, f) => { acc[f.title] = ''; return acc; }, {} as Record<string, string>),
        [filters]
    );

    const [selectedFilters, setSelectedFilters] = useState(defaultFilters);
    const [pendingFilters, setPendingFilters] = useState({ ...defaultFilters });
    const [easyApply, setEasyApply] = useState(false);

    const updateUrlParams = useCallback((filters: Record<string, string>, easy: boolean) => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, val]) => {
            if (val) params.set(key.toLowerCase().replace(/ /g, ''), val);
        });
        if (easy) params.set('easyApply', 'true');
        router.push(`/jobs?${params.toString()}`);
    }, [router]);

    const handlePending = useCallback((title: string, option: string) => {
        setPendingFilters(prev => ({
            ...prev,
            [title]: prev[title] === option ? '' : option,
        }));
    }, []);

    const applyFilter = useCallback((title: string) => {
        const next = { ...selectedFilters, [title]: pendingFilters[title] };
        setSelectedFilters(next);
        updateUrlParams(next, easyApply);
    }, [selectedFilters, pendingFilters, easyApply, updateUrlParams]);

    const cancelFilter = useCallback((title: string) => {
        setPendingFilters(prev => ({ ...prev, [title]: selectedFilters[title] }));
    }, [selectedFilters]);

    const resetAll = useCallback(() => {
        setSelectedFilters(defaultFilters);
        setPendingFilters(defaultFilters);
        setEasyApply(false);
        router.push('/jobs');
    }, [defaultFilters, router]);

    const activeCount = Object.values(selectedFilters).filter(Boolean).length + (easyApply ? 1 : 0);

    return (
        <div className="w-full bg-white border-b border-slate-100 py-2.5 flex items-center gap-2 overflow-x-auto">

            {/* Filter pills */}
            {filters.map((filter) => {
                const active = selectedFilters[filter.title];
                const isActive = !!active;

                return (
                    <DropdownMenu key={filter.id} onOpenChange={(open) => {
                        if (!open) cancelFilter(filter.title);
                    }}>
                        <DropdownMenuTrigger asChild>
                            <button
                                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-semibold whitespace-nowrap transition-all duration-200 outline-none flex-shrink-0 ${isActive
                                        ? "bg-indigo-50 border-indigo-400 text-indigo-700"
                                        : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-800"
                                    }`}
                            >
                                {isActive && <Check className="w-3 h-3" strokeWidth={2.5} />}
                                {active || filter.title}
                                <ChevronDown className="w-3 h-3 opacity-60" strokeWidth={2.5} />
                            </button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent
                            align="start"
                            className="w-[260px] rounded-2xl border border-slate-200 bg-white shadow-lg p-0 overflow-hidden"
                            sideOffset={6}
                        >
                            {/* Header */}
                            <div className="px-4 py-3 border-b border-slate-100">
                                <p className="text-xs font-bold text-slate-800">{filter.title}</p>
                            </div>

                            {/* Options */}
                            <ul className="max-h-52 overflow-y-auto py-1">
                                {filter.options.map((opt) => {
                                    const isChecked = pendingFilters[filter.title] === opt;
                                    return (
                                        <li
                                            key={opt}
                                            onClick={() => handlePending(filter.title, opt)}
                                            className="flex items-center justify-between gap-3 px-4 py-2.5 cursor-pointer hover:bg-indigo-50 transition-colors duration-150"
                                        >
                                            <span className={`text-sm capitalize ${isChecked ? "text-indigo-700 font-semibold" : "text-slate-700"}`}>
                                                {opt}
                                            </span>
                                            {isChecked && (
                                                <div className="w-4 h-4 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0">
                                                    <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                                                </div>
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>

                            {/* Footer actions */}
                            <div className="flex items-center justify-between gap-2 px-4 py-3 border-t border-slate-100 bg-slate-50/60">
                                <button
                                    onClick={() => {
                                        setPendingFilters(prev => ({ ...prev, [filter.title]: '' }));
                                    }}
                                    className="text-xs font-semibold text-slate-500 hover:text-slate-700 transition-colors duration-200"
                                >
                                    Clear
                                </button>
                                <button
                                    onClick={() => applyFilter(filter.title)}
                                    className="inline-flex items-center gap-1 rounded-lg bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors duration-200"
                                >
                                    Apply
                                </button>
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            })}

            {/* Easy Apply toggle */}
            <button
                onClick={() => {
                    const next = !easyApply;
                    setEasyApply(next);
                    updateUrlParams(selectedFilters, next);
                }}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-semibold whitespace-nowrap transition-all duration-200 flex-shrink-0 ${easyApply
                        ? "bg-indigo-600 border-indigo-600 text-white"
                        : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-800"
                    }`}
            >
                <Zap className={`w-3 h-3 ${easyApply ? "text-white" : "text-slate-400"}`} strokeWidth={2.5} />
                Easy Apply
            </button>

            {/* Reset — only shown when filters are active */}
            {activeCount > 0 && (
                <button
                    onClick={resetAll}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-red-500 hover:bg-red-50 transition-all duration-200 flex-shrink-0 whitespace-nowrap"
                >
                    <X className="w-3 h-3" strokeWidth={2.5} />
                    Reset{activeCount > 1 ? ` (${activeCount})` : ""}
                </button>
            )}
        </div>
    );
};

export default FilterNavbar;