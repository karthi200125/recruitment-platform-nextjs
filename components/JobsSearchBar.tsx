'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import Image from 'next/image';

interface JobResult {
    id: number;
    jobTitle: string;
    companyName: string;
    companyImage: string | null;
    city: string;
}

interface JobsSearchBarProps {
    className?: string;
    showPopularTags?: boolean;
}

type SearchField = 'query' | 'location' | null;

const SearchIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
    </svg>
);

const LocationIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
        <circle cx="12" cy="10" r="3" />
    </svg>
);

const SpinnerIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="animate-spin">
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
);

const ClearIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 6 6 18M6 6l12 12" />
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
    const [debouncedLocation, setDebouncedLocation] = useState('');

    const [suggestions, setSuggestions] = useState<JobResult[]>([]);
    const [openSuggestions, setOpenSuggestions] = useState(false);

    // Only the field currently triggering the request shows a loader.
    const [loadingField, setLoadingField] = useState<SearchField>(null);

    // Keeps track of which input the user is currently using.
    const [activeField, setActiveField] = useState<SearchField>(null);

    const [activeIndex, setActiveIndex] = useState(-1);

    const containerRef = useRef<HTMLDivElement>(null);
    const queryInputRef = useRef<HTMLInputElement>(null);
    const locationInputRef = useRef<HTMLInputElement>(null);

    const previousDebouncedQuery = useRef('');
    const previousDebouncedLocation = useRef('');

    const requestIdRef = useRef(0);

    /*
     * DEBOUNCE
     */
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(query);
            setDebouncedLocation(location);
        }, 400);

        return () => clearTimeout(timer);
    }, [query, location]);

    /*
     * FETCH SUGGESTIONS
     *
     * The API request can contain both q and location,
     * but the loader belongs only to the field the user changed.
     */
    useEffect(() => {
        const fetchSuggestions = async () => {
            const trimmedQuery = debouncedQuery.trim();
            const trimmedLocation = debouncedLocation.trim();

            if (!trimmedQuery && !trimmedLocation) {
                setSuggestions([]);
                setOpenSuggestions(false);
                setLoadingField(null);
                previousDebouncedQuery.current = debouncedQuery;
                previousDebouncedLocation.current = debouncedLocation;
                return;
            }

            /*
             * Determine which value actually changed.
             */
            const queryChanged =
                debouncedQuery !== previousDebouncedQuery.current;

            const locationChanged =
                debouncedLocation !== previousDebouncedLocation.current;

            let currentField: SearchField = activeField;

            if (queryChanged && !locationChanged) {
                currentField = 'query';
            } else if (locationChanged && !queryChanged) {
                currentField = 'location';
            }

            previousDebouncedQuery.current = debouncedQuery;
            previousDebouncedLocation.current = debouncedLocation;

            const requestId = ++requestIdRef.current;

            try {
                setLoadingField(currentField);

                const params = new URLSearchParams();

                if (trimmedQuery) {
                    params.set('q', trimmedQuery);
                }

                if (trimmedLocation) {
                    params.set('location', trimmedLocation);
                }

                const res = await fetch(
                    `/api/jobs/search?${params.toString()}`,
                    {
                        signal: AbortSignal.timeout(10000),
                    }
                );

                if (!res.ok) {
                    throw new Error('Failed to fetch suggestions');
                }

                const data: JobResult[] = await res.json();

                // Ignore stale requests.
                if (requestId !== requestIdRef.current) {
                    return;
                }

                setSuggestions(data);
                setOpenSuggestions(data.length > 0);
                setActiveIndex(-1);
            } catch (error) {
                if (
                    error instanceof DOMException &&
                    error.name === 'AbortError'
                ) {
                    return;
                }

                console.error(error);

                if (requestId === requestIdRef.current) {
                    setSuggestions([]);
                    setOpenSuggestions(false);
                }
            } finally {
                if (requestId === requestIdRef.current) {
                    setLoadingField(null);
                }
            }
        };

        fetchSuggestions();
    }, [debouncedQuery, debouncedLocation, activeField]);

    /*
     * CLOSE SUGGESTIONS WHEN CLICKING OUTSIDE
     */
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
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);

    /*
     * NORMAL SEARCH
     *
     * Example:
     * /jobs?q=react&location=bangalore
     */
    const handleSearch = useCallback(() => {
        const params = new URLSearchParams();

        if (query.trim()) {
            params.set('q', query.trim());
        }

        if (location.trim()) {
            params.set('location', location.trim());
        }

        const queryString = params.toString();

        router.push(queryString ? `/jobs?${queryString}` : '/jobs');

        setOpenSuggestions(false);
        setActiveIndex(-1);
    }, [query, location, router]);

    /*
     * SUGGESTION SELECTION
     *
     * If the user is searching the query field:
     *   q = selected job title
     *
     * If the user is searching the location field:
     *   location = selected job city
     *
     * Other existing search value is preserved.
     */
    const selectSuggestion = useCallback(
        (job: JobResult) => {
            const params = new URLSearchParams();

            if (activeField === 'location') {
                // Location suggestion
                if (query.trim()) {
                    params.set('q', query.trim());
                }

                if (job.city.trim()) {
                    params.set('location', job.city.trim());
                }

                setLocation(job.city);
            } else {
                // Query suggestion
                if (job.jobTitle.trim()) {
                    params.set('q', job.jobTitle.trim());
                }

                if (location.trim()) {
                    params.set('location', location.trim());
                }

                setQuery(job.jobTitle);
            }

            const queryString = params.toString();

            /*
             * Navigate immediately.
             */
            router.push(queryString ? `/jobs?${queryString}` : '/jobs');

            setOpenSuggestions(false);
            setSuggestions([]);
            setActiveIndex(-1);
        },
        [activeField, query, location, router]
    );

    /*
     * QUERY KEYBOARD NAVIGATION
     */
    const handleQueryKeyDown = (
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

                setActiveIndex((prev) =>
                    Math.max(prev - 1, -1)
                );

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

    /*
     * LOCATION KEYBOARD NAVIGATION
     */
    const handleLocationKeyDown = (
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

                setActiveIndex((prev) =>
                    Math.max(prev - 1, -1)
                );

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
                    ? 'border-white/10 bg-white/10'
                    : 'border-slate-200 bg-white/10 backdrop-blur-xl'
                    }`}
            >
                {/* QUERY */}
                <div
                    className="flex min-h-[56px] flex-1 items-center gap-3 px-3 md:px-5"
                    onClick={() => {
                        setActiveField('query');
                        queryInputRef.current?.focus();
                    }}
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
                            onChange={(e) => {
                                setQuery(e.target.value);
                                setActiveField('query');
                            }}
                            onFocus={() => {
                                setActiveField('query');

                                if (suggestions.length > 0) {
                                    setOpenSuggestions(true);
                                }
                            }}
                            onKeyDown={handleQueryKeyDown}
                            className={`w-full border-none bg-transparent text-sm outline-none ${isHomePage
                                ? 'text-white placeholder:text-slate-500'
                                : 'text-slate-800 placeholder:text-slate-400'
                                }`}
                        />

                        {/* QUERY LOADER ONLY */}
                        {loadingField === 'query' && (
                            <div className="flex-shrink-0 text-slate-400">
                                <SpinnerIcon />
                            </div>
                        )}

                        {query && loadingField !== 'query' && (
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();

                                    setQuery('');
                                    setSuggestions([]);
                                    setOpenSuggestions(false);
                                    setActiveIndex(-1);
                                }}
                                className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-500 transition hover:bg-slate-300"
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
                    onClick={() => {
                        setActiveField('location');
                        locationInputRef.current?.focus();
                    }}
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
                            onChange={(e) => {
                                setLocation(e.target.value);
                                setActiveField('location');
                            }}
                            onFocus={() => {
                                setActiveField('location');

                                if (suggestions.length > 0) {
                                    setOpenSuggestions(true);
                                }
                            }}
                            onKeyDown={handleLocationKeyDown}
                            className={`w-full border-none bg-transparent text-sm outline-none ${isHomePage
                                ? 'text-white placeholder:text-slate-500'
                                : 'text-slate-800 placeholder:text-slate-400'
                                }`}
                        />

                        {/* LOCATION LOADER ONLY */}
                        {loadingField === 'location' && (
                            <div className="flex-shrink-0 text-slate-400">
                                <SpinnerIcon />
                            </div>
                        )}

                        {location && loadingField !== 'location' && (
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();

                                    setLocation('');
                                    setSuggestions([]);
                                    setOpenSuggestions(false);
                                    setActiveIndex(-1);
                                }}
                                className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-500 transition hover:bg-slate-300"
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
                                setActiveField('query');
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
                <div className="absolute left-0 right-0 top-[calc(100%+12px)] z-50 overflow-y-auto rounded-3xl border border-slate-200 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
                    {suggestions.map((job, index) => (
                        <div
                            key={job.id}
                            onMouseDown={(e) => {
                                e.preventDefault();

                                /*
                                 * Navigate immediately.
                                 */
                                selectSuggestion(job);
                            }}
                            onMouseEnter={() => setActiveIndex(index)}
                            className={`flex cursor-pointer items-center gap-4 border-b border-slate-100 px-5 py-4 transition-all duration-150 last:border-none ${activeIndex === index
                                ? 'bg-slate-100'
                                : 'hover:bg-slate-50'
                                }`}
                        >
                            <div className="relative flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                                <Image
                                    src={job.companyImage || '/noImage.webp'}
                                    alt={job.companyName}
                                    fill
                                    sizes="40px"
                                    className="object-cover"
                                />
                            </div>

                            <div className="min-w-0 flex-1 text-start">
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
                            {suggestions.length}{' '}
                            {suggestions.length === 1
                                ? 'result'
                                : 'results'}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JobsSearchBar;