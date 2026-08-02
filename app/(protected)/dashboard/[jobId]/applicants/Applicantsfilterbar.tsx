"use client";

import { Search, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const STATUS_OPTIONS = [
    { label: "All statuses", value: "" },
    { label: "Applied", value: "APPLIED" },
    { label: "Viewed", value: "VIEWED" },
    { label: "Under Review", value: "UNDER_REVIEW" },
    { label: "Shortlisted", value: "SHORTLISTED" },
    { label: "Interview Scheduled", value: "INTERVIEW_SCHEDULED" },
    { label: "Interviewed", value: "INTERVIEWED" },
    { label: "Hired", value: "HIRED" },
    { label: "Rejected", value: "REJECTED" },
    { label: "Withdrawn", value: "WITHDRAWN" },
];

const TIME_OPTIONS = [
    { label: "Any time", value: "" },
    { label: "Today", value: "today" },
    { label: "Yesterday", value: "yesterday" },
    { label: "2-3 days ago", value: "3days" },
    { label: "4-7 days ago", value: "week" },
    { label: "Older", value: "older" },
];

const SORT_OPTIONS = [
    { label: "Newest first", value: "newest" },
    { label: "Best skill match", value: "match" },
];

const SEARCH_DEBOUNCE_MS = 400;

export function ApplicantsFilterBar() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const urlSearch = searchParams.get("search") ?? "";
    const [searchInput, setSearchInput] = useState(urlSearch);

    useEffect(() => {
        setSearchInput(urlSearch);
    }, [urlSearch]);

    const updateParam = useCallback(
        (key: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString());
            if (value) {
                params.set(key, value);
            } else {
                params.delete(key);
            }
            params.delete("applicantId");
            router.push(`${pathname}?${params.toString()}`);
        },
        [pathname, router, searchParams]
    );

    useEffect(() => {
        if (searchInput === urlSearch) return;

        const timeout = setTimeout(() => {
            updateParam("search", searchInput);
        }, SEARCH_DEBOUNCE_MS);

        return () => clearTimeout(timeout);
    }, [searchInput, urlSearch, updateParam]);

    return (
        <div className="space-y-3 border-b border-slate-100 p-4">
            <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Search candidates..."
                    className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-9 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                />
                {searchInput && (
                    <button
                        type="button"
                        onClick={() => setSearchInput("")}
                        className="absolute right-2.5 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100"
                    >
                        <X className="h-3.5 w-3.5" />
                    </button>
                )}
            </div>

            <div className="grid grid-cols-2 gap-2">
                <select
                    value={searchParams.get("status") ?? ""}
                    onChange={(e) => updateParam("status", e.target.value)}
                    className="h-9 rounded-lg border border-slate-200 bg-white px-2 text-xs font-medium text-slate-700 outline-none"
                >
                    {STATUS_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>

                <select
                    value={searchParams.get("appliedWithin") ?? ""}
                    onChange={(e) => updateParam("appliedWithin", e.target.value)}
                    className="h-9 rounded-lg border border-slate-200 bg-white px-2 text-xs font-medium text-slate-700 outline-none"
                >
                    {TIME_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            </div>

            <select
                value={searchParams.get("sort") ?? "newest"}
                onChange={(e) => updateParam("sort", e.target.value)}
                className="h-9 w-full rounded-lg border border-slate-200 bg-white px-2 text-xs font-medium text-slate-700 outline-none"
            >
                {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </div>
    );
}