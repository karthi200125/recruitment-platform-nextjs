'use client';

import { Check, ChevronDown, X, Zap } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
    useTransition,
} from 'react';

import {
    DatePosted,
    experiences,
    JobMode
} from "@/lib/getOptionsData";

interface Filter {
    id: number;
    title: string;
    options: string[];
}

interface FilterDropdownProps {
    filter: Filter;
    activeValue: string;
    open: boolean;
    onOpen: () => void;
    onClose: () => void;
    onApply: (value: string) => void;
}

interface FilterNavbarProps {
    companynames: string[];
    states: string[];
}

const PARAM_KEYS: Record<string, string> = {
    "Date Posted": "dateposted",
    "Experience": "experiencelevel",
    "Type": "type",
    "Location": "location",
    "Company": "company",
};


const FilterDropdown = ({
    filter, activeValue, open, onOpen, onClose, onApply,
}: FilterDropdownProps) => {
    const triggerRef = useRef<HTMLButtonElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);
    const [pending, setPending] = useState(activeValue);

    useEffect(() => { setPending(activeValue); }, [activeValue]);

    useEffect(() => {
        if (!open) return;
        const handler = (e: MouseEvent) => {
            if (
                triggerRef.current?.contains(e.target as Node) ||
                panelRef.current?.contains(e.target as Node)
            ) return;
            setPending(activeValue);
            onClose();
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [open, activeValue, onClose]);

    const isActive = !!activeValue;

    return (
        <div className="relative flex-shrink-0">
            <button
                ref={triggerRef}
                type="button"
                onClick={() => open ? onClose() : onOpen()}
                className={`
                    inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border
                    text-xs font-semibold whitespace-nowrap select-none
                    outline-none transition-all duration-150
                    ${isActive
                        ? 'bg-indigo-50 border-indigo-400 text-indigo-700'
                        : open
                            ? 'bg-slate-50 border-slate-300 text-slate-800'
                            : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-800'
                    }
                `}
            >
                {isActive && <Check className="w-3 h-3" strokeWidth={2.5} />}
                {activeValue || filter.title}
                <ChevronDown
                    className={`w-3 h-3 opacity-60 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                    strokeWidth={2.5}
                />
            </button>

            {open && (
                <div
                    ref={panelRef}
                    className="absolute top-full left-0 mt-2 z-50 w-60 rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden"
                    onTouchStart={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="px-4 py-3 border-b border-slate-100">
                        <p className="text-xs font-bold text-slate-800">{filter.title}</p>
                    </div>

                    {/* Options */}
                    <ul className="max-h-52 overflow-y-auto py-1">
                        {filter.options.map((opt) => {
                            const checked = pending === opt;
                            return (
                                <li
                                    key={opt}
                                    onClick={() => setPending(checked ? '' : opt)}
                                    className="flex items-center justify-between gap-3 px-4 py-2.5 cursor-pointer hover:bg-indigo-50 active:bg-indigo-100 transition-colors duration-100 select-none"
                                >
                                    <span className={`text-sm capitalize ${checked ? 'text-indigo-700 font-semibold' : 'text-slate-700'}`}>
                                        {opt}
                                    </span>
                                    {checked && (
                                        <div className="w-4 h-4 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0">
                                            <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                                        </div>
                                    )}
                                </li>
                            );
                        })}
                    </ul>

                    {/* Footer */}
                    <div className="flex items-center justify-between gap-2 px-4 py-3 border-t border-slate-100 bg-slate-50/60">
                        <button
                            type="button"
                            onClick={() => { setPending(''); }}
                            className="text-xs font-semibold text-slate-500 hover:text-slate-700 transition-colors"
                        >
                            Clear
                        </button>
                        <button
                            type="button"
                            onClick={() => { onApply(pending); onClose(); }}
                            className="rounded-lg bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 active:bg-indigo-700 transition-colors"
                        >
                            Apply
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

// ─── FilterNavbar ─────────────────────────────────────────────────────────────

export default function FilterNavbarClient({ companynames, states }: FilterNavbarProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [isPending, startTransition] = useTransition();

    const [openId, setOpenId] = useState<number | null>(null);

    const locations = useMemo(() => states.map((s: any) => s.name), [states]);

    const filters: Filter[] = useMemo(() => [
        { id: 1, title: 'Date Posted', options: DatePosted },
        { id: 2, title: 'Experience', options: experiences },
        { id: 3, title: 'Type', options: JobMode },
        { id: 4, title: 'Location', options: locations },
        { id: 5, title: 'Company', options: companynames },
    ], [locations, companynames]);

    const getActive = (title: string) =>
        searchParams.get(PARAM_KEYS[title]) ?? '';

    const easyApply = searchParams.get('easyApply') === 'true';

    const updateUrl = useCallback((updates: Record<string, string | null>) => {
        startTransition(() => {
            const params = new URLSearchParams(searchParams.toString());

            params.delete('page');

            Object.entries(updates).forEach(([key, val]) => {
                if (val) params.set(key, val);
                else params.delete(key);
            });

            router.replace(`/jobs?${params.toString()}`, { scroll: false });
        });
    }, [router, searchParams]);

    const handleApply = useCallback(
        (filter: Filter, value: string) => {
            const key = PARAM_KEYS[filter.title];

            updateUrl({
                [key]: value || null,
            });

            setOpenId(null);
        },
        [updateUrl]
    );

    const toggleEasyApply = useCallback(() => {
        updateUrl({ easyApply: easyApply ? null : 'true' });
    }, [easyApply, updateUrl]);

    const resetAll = useCallback(() => {
        startTransition(() => {
            router.replace('/jobs', { scroll: false });
        });
        setOpenId(null);
    }, [router]);

    const activeCount = filters.filter((f) => !!getActive(f.title)).length + (easyApply ? 1 : 0);

    return (
        <div className={`
            w-full bg-white border-b border-slate-100 px-4 py-2.5
            flex items-center gap-2 overflow-x-auto scrollbar-hide
            transition-opacity duration-200 ${isPending ? 'opacity-70' : 'opacity-100'}
        `}>
            {filters.map((filter) => (
                <FilterDropdown
                    key={filter.id}
                    filter={filter}
                    activeValue={getActive(filter.title)}
                    open={openId === filter.id}
                    onOpen={() => setOpenId(filter.id)}
                    onClose={() => setOpenId(null)}
                    onApply={(val) => handleApply(filter, val)}
                />
            ))}

            {/* Easy Apply */}
            <button
                type="button"
                onClick={toggleEasyApply}
                disabled={isPending}
                className={`
                    inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border
                    text-xs font-semibold whitespace-nowrap select-none
                    transition-all duration-150 flex-shrink-0
                    ${easyApply
                        ? 'bg-indigo-600 border-indigo-600 text-white'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }
                `}
            >
                <Zap className={`w-3 h-3 ${easyApply ? 'text-white' : 'text-slate-400'}`} strokeWidth={2.5} />
                Easy Apply
            </button>

            {/* Reset */}
            {activeCount > 0 && (
                <button
                    type="button"
                    onClick={resetAll}
                    disabled={isPending}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-red-500 hover:bg-red-50 transition-all duration-150 flex-shrink-0 whitespace-nowrap select-none"
                >
                    <X className="w-3 h-3" strokeWidth={2.5} />
                    Reset{activeCount > 1 ? ` (${activeCount})` : ''}
                </button>
            )}
        </div>
    );
}