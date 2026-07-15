"use client";

import { Search, X } from "lucide-react";

interface DashboardSearchProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

const DashboardSearch = ({
    value,
    onChange,
    placeholder = "Search...",
    className,
}: DashboardSearchProps) => {
    return (
        <div className={className}>
            <div className="relative w-full">
                <Search
                    className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
                    strokeWidth={2}
                />

                <input
                    type="text"
                    value={value}
                    placeholder={placeholder}
                    onChange={(e) =>
                        onChange(e.target.value)
                    }
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-12 pr-12 text-[14px] text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                {value && (
                    <button
                        type="button"
                        onClick={() => onChange("")}
                        className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                    >
                        <X
                            className="h-4 w-4"
                            strokeWidth={2}
                        />
                    </button>
                )}
            </div>
        </div>
    );
};

export default DashboardSearch;