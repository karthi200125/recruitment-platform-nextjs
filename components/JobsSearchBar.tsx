'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

interface JobResult {
    id: number;
    jobTitle: string;
    companyName: string;
    city: string;
}

interface JobsSearchBarProps {
    className?: string;
    showPopularTags?: boolean;
}

const SearchIcon = () => (
    <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
    </svg>
);

const LocationIcon = () => (
    <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
        <circle cx="12" cy="10" r="3" />
    </svg>
);

const SpinnerIcon = () => (
    <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        className="animate-spin"
    >
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
);

const ClearIcon = () => (
    <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M18 6 6 18M6 6l12 12" />
    </svg>
);

const BriefcaseIcon = () => (
    <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
);

const popularTags = [
    'Remote',
    'Frontend Developer',
    'Full Stack',
    'Product Manager',
    'UI/UX Designer',
];

const JobsSearchBar = ({
    className,
    showPopularTags = true,
}: JobsSearchBarProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const isHomePage = pathname === '/';

    const [query, setQuery] = useState(searchParams.get('q') || '');
    const [location, setLocation] = useState(
        searchParams.get('location') || ''
    );

    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [suggestions, setSuggestions] = useState<JobResult[]>([]);
    const [openSuggestions, setOpenSuggestions] = useState(false);
    const [loading, setLoading] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);

    const containerRef = useRef<HTMLDivElement>(null);
    const queryInputRef = useRef<HTMLInputElement>(null);
    const locationInputRef = useRef<HTMLInputElement>(null);

    // debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(query);
        }, 400);

        return () => clearTimeout(timer);
    }, [query]);

    // fetch suggestions
    useEffect(() => {
        const fetchSuggestions = async () => {
            if (!debouncedQuery.trim()) {
                setSuggestions([]);
                setOpenSuggestions(false);
                return;
            }

            try {
                setLoading(true);

                const res = await fetch(
                    `/api/jobs/search?q=${encodeURIComponent(debouncedQuery)}`
                );

                if (!res.ok) {
                    throw new Error('Failed to fetch suggestions');
                }

                const data = await res.json();

                setSuggestions(data);
                setOpenSuggestions(data.length > 0);
                setActiveIndex(-1);
            } catch (error) {
                console.error(error);
                setSuggestions([]);
            } finally {
                setLoading(false);
            }
        };

        fetchSuggestions();
    }, [debouncedQuery]);

    // outside click
    useEffect(() => {
        const handleOutsideClick = (e: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(e.target as Node)
            ) {
                setOpenSuggestions(false);
                setActiveIndex(-1);
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);

        return () => {
            document.removeEventListener(
                'mousedown',
                handleOutsideClick
            );
        };
    }, []);

    const handleSearch = useCallback(() => {
        const params = new URLSearchParams();

        if (query.trim()) {
            params.set('q', query.trim());
        }

        if (location.trim()) {
            params.set('location', location.trim());
        }

        router.push(`/jobs?${params.toString()}`);

        setOpenSuggestions(false);
        setActiveIndex(-1);
    }, [query, location, router]);

    const selectSuggestion = (job: JobResult) => {
        const params = new URLSearchParams();

        params.set('q', job.jobTitle);

        if (location.trim()) {
            params.set('location', location.trim());
        }

        router.push(`/jobs?${params.toString()}`);

        setQuery(job.jobTitle);
        setOpenSuggestions(false);
        setActiveIndex(-1);
    };

    const handleKeyDown = (
        e: React.KeyboardEvent<HTMLInputElement>
    ) => {
        if (!openSuggestions || suggestions.length === 0) {
            if (e.key === 'Enter') {
                handleSearch();
            }

            return;
        }

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();

                setActiveIndex((prev) =>
                    Math.min(prev + 1, suggestions.length - 1)
                );

                break;

            case 'ArrowUp':
                e.preventDefault();

                setActiveIndex((prev) => Math.max(prev - 1, -1));

                break;

            case 'Escape':
                setOpenSuggestions(false);
                setActiveIndex(-1);

                break;

            case 'Enter':
                e.preventDefault();

                if (activeIndex >= 0) {
                    selectSuggestion(suggestions[activeIndex]);
                } else {
                    handleSearch();
                }

                break;
        }
    };

    return (
        <div
            ref={containerRef}
            className={`relative w-full min-w-0 ${className || ''}`}
        >
            {/* SEARCH BAR */}
            <div
                className={`flex w-full flex-col overflow-hidden rounded-2xl border p-2 shadow-[0_4px_30px_rgba(0,0,0,0.06)] transition-all duration-300 focus-within:shadow-[0_8px_40px_rgba(0,0,0,0.10)] md:h-[70px] md:flex-row md:items-center md:rounded-full ${isHomePage
                    ? 'border-white/10 bg-black'
                    : 'border-slate-200 bg-white/10 backdrop-blur-xl'
                    }`}
            >
                {/* QUERY */}
                <div
                    className="flex min-h-[56px] flex-1 items-center gap-3 px-3 md:px-5"
                    onClick={() => queryInputRef.current?.focus()}
                >
                    <div
                        className={`flex-shrink-0 ${isHomePage
                            ? 'text-slate-400'
                            : 'text-slate-500'
                            }`}
                    >
                        <SearchIcon />
                    </div>

                    <div className="flex flex-1 items-center gap-2">
                        <input
                            ref={queryInputRef}
                            type="text"
                            placeholder="Job title, company, skills..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={handleKeyDown}
                            onFocus={() => {
                                if (suggestions.length > 0) {
                                    setOpenSuggestions(true);
                                }
                            }}
                            className={`w-full border-none bg-transparent text-sm outline-none ${isHomePage
                                ? 'text-white placeholder:text-slate-500'
                                : 'text-slate-800 placeholder:text-slate-400'
                                }`}
                        />

                        {loading && (
                            <div className="text-slate-400">
                                <SpinnerIcon />
                            </div>
                        )}

                        {query && !loading && (
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();

                                    setQuery('');
                                    setSuggestions([]);
                                    setOpenSuggestions(false);
                                }}
                                className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-slate-500 transition hover:bg-slate-300"
                            >
                                <ClearIcon />
                            </button>
                        )}
                    </div>
                </div>

                {/* DIVIDER */}
                <div
                    className={`mx-4 hidden h-10 w-px md:block ${isHomePage
                        ? 'bg-white/10'
                        : 'bg-slate-200'
                        }`}
                />

                <div
                    className={`mx-4 h-px md:hidden ${isHomePage
                        ? 'bg-white/10'
                        : 'bg-slate-200'
                        }`}
                />

                {/* LOCATION */}
                <div
                    className="flex min-h-[56px] flex-1 items-center gap-3 px-3 md:px-5"
                    onClick={() => locationInputRef.current?.focus()}
                >
                    <div
                        className={`flex-shrink-0 ${isHomePage
                            ? 'text-slate-400'
                            : 'text-slate-500'
                            }`}
                    >
                        <LocationIcon />
                    </div>

                    <div className="flex flex-1 items-center gap-2">
                        <input
                            ref={locationInputRef}
                            type="text"
                            placeholder="City, state, remote..."
                            value={location}
                            onChange={(e) =>
                                setLocation(e.target.value)
                            }
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleSearch();
                                }
                            }}
                            className={`w-full border-none bg-transparent text-sm outline-none ${isHomePage
                                ? 'text-white placeholder:text-slate-500'
                                : 'text-slate-800 placeholder:text-slate-400'
                                }`}
                        />

                        {location && (
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setLocation('');
                                }}
                                className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-slate-500 transition hover:bg-slate-300"
                            >
                                <ClearIcon />
                            </button>
                        )}
                    </div>
                </div>

                {/* SEARCH BUTTON */}
                <button
                    type="button"
                    onClick={handleSearch}
                    className="mt-2 flex h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 text-sm font-semibold text-white transition-all duration-200 hover:bg-indigo-500 md:mt-0 md:w-auto md:min-w-[140px] md:rounded-full"
                >
                    <SearchIcon />
                    <span>Find Jobs</span>
                </button>
            </div>

            {/* POPULAR TAGS */}
            {showPopularTags && (
                <div className="mt-4 flex flex-wrap gap-2">
                    {popularTags.map((tag) => (
                        <button
                            key={tag}
                            onClick={() => {
                                setQuery(tag);
                                queryInputRef.current?.focus();
                            }}
                            className={`rounded-full border px-4 py-2 text-xs font-medium transition-all duration-200 ${isHomePage
                                ? 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                                : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                                }`}
                        >
                            {tag}
                        </button>
                    ))}
                </div>
            )}

            {/* SUGGESTIONS */}
            {openSuggestions && suggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-[calc(100%+12px)] z-50 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
                    {suggestions.map((job, index) => (
                        <div
                            key={job.id}
                            onMouseDown={(e) => {
                                e.preventDefault();
                                selectSuggestion(job);
                            }}
                            onMouseEnter={() =>
                                setActiveIndex(index)
                            }
                            className={`flex cursor-pointer items-center gap-4 border-b border-slate-100 px-5 py-4 transition-all duration-150 last:border-none ${activeIndex === index
                                ? 'bg-slate-100'
                                : 'hover:bg-slate-50'
                                }`}
                        >
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-500">
                                <BriefcaseIcon />
                            </div>

                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-semibold text-slate-800">
                                    {job.jobTitle}
                                </p>

                                <p className="truncate text-xs text-slate-400">
                                    {job.companyName} • {job.city}
                                </p>
                            </div>
                        </div>
                    ))}

                    {/* FOOTER */}
                    <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-5 py-3 text-xs text-slate-400">
                        <div className="flex items-center gap-2">
                            <span className="rounded border bg-white px-1.5 py-0.5">
                                ↑↓
                            </span>

                            navigate

                            <span className="ml-2 rounded border bg-white px-1.5 py-0.5">
                                ↵
                            </span>

                            select
                        </div>

                        <span>
                            {suggestions.length} result
                            {suggestions.length > 1 ? 's' : ''}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JobsSearchBar;