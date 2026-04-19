'use client';

import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from 'next/navigation';
import { ChangeEvent, KeyboardEvent, useEffect, useState } from 'react';
import { IoSearchOutline } from "react-icons/io5";
import { Skeleton } from "../ui/skeleton";
import { getJobTitles } from "@/actions/job/getJobTitles";

const Search = () => {

    const searchParams = useSearchParams()    

    const [query, setQuery] = useState<string>('');
    const [debouncedQuery, setDebouncedQuery] = useState<string>('');
    const [openSuggestion, setOpenSuggestion] = useState<boolean>(false);
    const [filteredJobTitles, setFilteredJobTitles] = useState<string[]>([]);
    const router = useRouter();

    // Debounce input
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedQuery(query);
        }, 500);
        return () => clearTimeout(handler);
    }, [query]);

    // Fetch job titles using react-query
    const { data: allJobTitles = [], isLoading } = useQuery({
        queryKey: ['getJobTitles', debouncedQuery],
        queryFn: async () => {
            if (debouncedQuery) {
                return await getJobTitles(debouncedQuery);
            }
            return [];
        },
        enabled: !!debouncedQuery,
    });

    // Update filtered job titles based on query
    useEffect(() => {
        if (debouncedQuery && Array.isArray(allJobTitles)) {
            const matchedJobTitles = allJobTitles.filter((job) =>
                job.jobTitle.toLowerCase().includes(debouncedQuery.toLowerCase())
            );
            setFilteredJobTitles(matchedJobTitles.map((job) => job.jobTitle));
            setOpenSuggestion(matchedJobTitles.length > 0);
        } else {
            setOpenSuggestion(false);
        }
    }, [debouncedQuery, allJobTitles]);

    // Update search params and navigate
    const updateSearchParams = (value: string) => {
        const params = new URLSearchParams(window.location.search);
        params.set('q', value);
        router.push(`/jobs?${params.toString()}`);
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
    };

    const handleSelectJobTitle = (jobTitle: string) => {
        setQuery(jobTitle);
        updateSearchParams(jobTitle);
        setOpenSuggestion(false);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && filteredJobTitles.length > 0) {
            const selectedJobTitle = filteredJobTitles[0];
            handleSelectJobTitle(selectedJobTitle);
        }
    };

    return (
        <div className='relative w-[200px] md:w-[300px] h-[40px] bg-white/10 rounded-md flex flex-row items-center gap-2 p-1'>
            <input
                type="text"
                className='w-[90%] h-full pl-5 placeholder:text-white/40 bg-transparent text-xs text-white'
                placeholder="Title, job title, or company"
                value={query}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
            />
            <div
                className='w-[35px] h-[35px] rounded-md flexcenter bg-white cursor-pointer text-black'
                onClick={() => handleSelectJobTitle(debouncedQuery)}
            >
                <IoSearchOutline size={20} />
            </div>

            {openSuggestion && (
                <div className='absolute top-[55px] left-0 w-full bg-white p-3 rounded-xl shadow-xl max-h-[300px] overflow-y-auto'>
                    {isLoading ? (
                        <div className="space-y-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Skeleton className="bg-neutral-100 h-8 px-3" key={i} />
                            ))}
                        </div>
                    ) : filteredJobTitles.length > 0 ? (
                        filteredJobTitles.map((jobTitle: string) => (
                            <h4
                                key={jobTitle}
                                className='px-3 py-2 text-black rounded-md hover:bg-neutral-100 cursor-pointer transition'
                                onClick={() => handleSelectJobTitle(jobTitle)}
                            >
                                {jobTitle}
                            </h4>
                        ))
                    ) : (
                        <h4 className='px-3 py-2 text-black rounded-md'>
                            No job titles found
                        </h4>
                    )}
                </div>
            )}
        </div>
    );
};

export default Search;
