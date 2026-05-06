'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { IoSearchOutline, IoLocationOutline } from 'react-icons/io5';

interface JobResult {
    id: number;
    jobTitle: string;
    companyName: string;
    city: string;
}

const JobsSearchBar = () => {

    const router = useRouter();
    const searchParams = useSearchParams();

    const [query, setQuery] = useState('');
    const [location, setLocation] = useState('');

    const [debouncedQuery, setDebouncedQuery] = useState('');

    const [suggestions, setSuggestions] = useState<JobResult[]>([]);
    const [openSuggestions, setOpenSuggestions] = useState(false);

    // Debounce
    useEffect(() => {

        const timer = setTimeout(() => {
            setDebouncedQuery(query);
        }, 400);

        return () => clearTimeout(timer);

    }, [query]);

    // Fetch Suggestions
    useEffect(() => {

        const fetchSuggestions = async () => {

            if (!debouncedQuery) {
                setSuggestions([]);
                return;
            }

            try {

                const res = await fetch(
                    `/api/jobs/search?q=${debouncedQuery}`
                );

                const data = await res.json();

                setSuggestions(data);

                setOpenSuggestions(true);

            } catch (error) {
                console.error(error);
            }
        };

        fetchSuggestions();

    }, [debouncedQuery]);

    // Search Submit
    const handleSearch = () => {

        const params = new URLSearchParams(
            searchParams.toString()
        );

        if (query) {
            params.set('q', query);
        } else {
            params.delete('q');
        }

        if (location) {
            params.set('location', location);
        } else {
            params.delete('location');
        }

        router.push(`/jobs?${params.toString()}`);

        setOpenSuggestions(false);
    };

    return (
        <div className='w-full relative'>

            <div className='w-full bg-white border border-neutral-200 rounded-2xl p-2 flex flex-col lg:flex-row items-stretch lg:items-center gap-2 shadow-sm'>

                {/* Search Input */}
                <div className='flex-1 flex items-center gap-3 px-4 h-[60px]'>

                    <IoSearchOutline
                        size={22}
                        className='text-neutral-500'
                    />

                    <input
                        type='text'
                        placeholder='Job title, skills, company...'
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className='w-full bg-transparent outline-none text-sm'
                    />
                </div>

                {/* Location */}
                <div className='flex-1 flex items-center gap-3 px-4 h-[60px] border-l border-neutral-200'>

                    <IoLocationOutline
                        size={22}
                        className='text-neutral-500'
                    />

                    <input
                        type='text'
                        placeholder='Location'
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className='w-full bg-transparent outline-none text-sm'
                    />
                </div>

                {/* Search Button */}
                <button
                    onClick={handleSearch}
                    className='h-[55px] px-8 rounded-xl bg-black text-white text-sm font-medium'
                >
                    Search
                </button>
            </div>

            {/* Suggestions */}
            {
                openSuggestions &&
                suggestions.length > 0 && (

                    <div className='absolute top-[85px] left-0 w-full bg-white border border-neutral-200 rounded-2xl shadow-xl overflow-hidden z-50'>

                        {
                            suggestions.map((job) => (

                                <div
                                    key={job.id}
                                    onClick={() => {
                                        setQuery(job.jobTitle);
                                        setOpenSuggestions(false);
                                    }}
                                    className='p-4 border-b border-neutral-100 hover:bg-neutral-50 cursor-pointer transition'
                                >

                                    <h3 className='text-sm font-medium'>
                                        {job.jobTitle}
                                    </h3>

                                    <p className='text-xs text-neutral-500 mt-1'>
                                        {job.companyName} • {job.city}
                                    </p>

                                </div>
                            ))
                        }

                    </div>
                )
            }
        </div>
    );
};

export default JobsSearchBar;