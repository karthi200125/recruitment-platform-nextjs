'use client'

import { getSkills } from '@/actions/getSkills';
import { debounce } from '@/lib/debounce';
import { Input } from '@/components/ui/input';
import { useQuery } from '@tanstack/react-query';
import React, { useCallback, useEffect, useState } from 'react';
import { IoClose } from "react-icons/io5";

interface JobSkillsProps {
    onSkills?: (value: string[]) => void,
    alreadySkills?: any;
}

const JobSkills = ({ onSkills , alreadySkills }: JobSkillsProps) => {
    const [query, setQuery] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedSkills, setSelectedSkills] = useState<string[]>(alreadySkills || []);

    const debouncedQuery = useCallback(
        debounce((query: string) => {
            if (query) {
                setShowSuggestions(true);
            } else {
                setShowSuggestions(false);
            }
        }, 500),
        []
    );

    useEffect(() => {
        debouncedQuery(query);
    }, [query, debouncedQuery]);

    const { data, isLoading } = useQuery<string[]>({
        queryKey: ['getSkills', query],
        queryFn: async () => getSkills(query),
        enabled: !!query
    });

    const handleSelectSkill = (skill: string) => {
        if (!selectedSkills.includes(skill)) {
            const updatedSkills = [...selectedSkills, skill];
            setSelectedSkills(updatedSkills);
            if (onSkills) {
                onSkills(updatedSkills);
            }
        }
        setQuery('');
        setShowSuggestions(false);
    };

    const handleRemoveSkill = (skill: string) => {
        const updatedSkills = selectedSkills.filter(s => s !== skill);
        setSelectedSkills(updatedSkills);
        if (onSkills) {
            onSkills(updatedSkills);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Prevent form submission if inside a form
            if (query && !selectedSkills.includes(query)) {
                const updatedSkills = [...selectedSkills, query];
                setSelectedSkills(updatedSkills);
                if (onSkills) {
                    onSkills(updatedSkills);
                }
                setQuery('');
                setShowSuggestions(false);
            }
        }
    };

    return (
        <div className='w-full max-h-max relative space-y-3'>
            <h4 className='font-bold'>Skills</h4>
            <Input
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
                value={query}
                onKeyDown={handleKeyDown} // Add keydown event handler
                placeholder='EX: ReactJs, Nextjs'
            />
            {showSuggestions && (
                <div className='absolute top-[70px] left-0 border w-full h-[300px] overflow-y-auto p-5 bg-white z-10 rounded-xl shadow-xl'>
                    {isLoading ? (
                        <h4>Loading...</h4>
                    ) : (
                        data && data.length > 0 ? (
                            data.map((res: string, i: number) => (
                                <h4
                                    key={i}
                                    className='px-3 py-2 hover:bg-neutral-100 rounded-md cursor-pointer'
                                    onClick={() => handleSelectSkill(res)}
                                >
                                    {res}
                                </h4>
                            ))
                        ) : (
                            <h4>No data</h4>
                        )
                    )}
                </div>
            )}
            {selectedSkills?.length > 0 &&
                <div className='flex flex-wrap gap-3'>
                    {selectedSkills.map((skill) => (
                        <div
                            key={skill}
                            className='px-5 rounded-full h-[40px] text-sm font-semibold border flexcenter capitalize flex flex-row items-center gap-3'
                        >
                            {skill}
                            <IoClose
                                size={20}
                                className='text-red-400 cursor-pointer'
                                onClick={() => handleRemoveSkill(skill)}
                            />
                        </div>
                    ))}
                </div>
            }
        </div>
    );
}

export default JobSkills;
