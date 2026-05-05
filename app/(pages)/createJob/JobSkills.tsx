'use client';

import { getSkills } from '@/actions/getSkills';
import { debounce } from '@/lib/debounce';
import { useQuery } from '@tanstack/react-query';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { X, Search, Loader2, Plus } from 'lucide-react';

interface JobSkillsProps {
    onSkills?: (value: string[]) => void;
    alreadySkills?: string[];
}

const JobSkills = ({ onSkills, alreadySkills }: JobSkillsProps) => {
    const [query, setQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedSkills, setSelectedSkills] = useState<string[]>(alreadySkills ?? []);
    const containerRef = useRef<HTMLDivElement>(null);

    // Debounce
    const debounceFn = useCallback(
        debounce((q: string) => {
            setDebouncedQuery(q);
            setShowSuggestions(!!q.trim());
        }, 400),
        []
    );

    useEffect(() => { debounceFn(query); }, [query, debounceFn]);

    // Close on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const { data: suggestions = [], isLoading } = useQuery<string[]>({
        queryKey: ['getSkills', debouncedQuery],
        queryFn: () => getSkills(debouncedQuery),
        enabled: !!debouncedQuery.trim(),
    });

    const addSkill = (skill: string) => {
        const trimmed = skill.trim();
        if (!trimmed || selectedSkills.includes(trimmed)) return;
        const updated = [...selectedSkills, trimmed];
        setSelectedSkills(updated);
        onSkills?.(updated);
        setQuery('');
        setDebouncedQuery('');
        setShowSuggestions(false);
    };

    const removeSkill = (skill: string) => {
        const updated = selectedSkills.filter((s) => s !== skill);
        setSelectedSkills(updated);
        onSkills?.(updated);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') { e.preventDefault(); addSkill(query); }
        if (e.key === 'Escape') setShowSuggestions(false);
    };

    const filteredSuggestions = suggestions.filter((s) => !selectedSkills.includes(s));

    return (
        <div className="w-full space-y-3" ref={containerRef}>

            {/* Search input */}
            <div className="relative">
                <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" strokeWidth={2} />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onFocus={() => query.trim() && setShowSuggestions(true)}
                        placeholder="Search skills or type and press Enter..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-12 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/30 transition-all duration-200"
                    />
                    {query.trim() && (
                        <button
                            type="button"
                            onClick={() => addSkill(query)}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white hover:bg-indigo-500 transition-colors duration-200"
                            aria-label="Add skill"
                        >
                            <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
                        </button>
                    )}
                </div>

                {/* Suggestions dropdown */}
                {showSuggestions && (
                    <div className="absolute top-full left-0 w-full mt-1.5 z-20 rounded-2xl border border-slate-200 bg-white shadow-lg overflow-hidden">
                        {isLoading ? (
                            <div className="flex items-center gap-2 px-4 py-4 text-sm text-slate-500">
                                <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2} />
                                Searching skills...
                            </div>
                        ) : filteredSuggestions.length > 0 ? (
                            <ul className="max-h-52 overflow-y-auto py-1">
                                {filteredSuggestions.map((skill, i) => (
                                    <li
                                        key={i}
                                        onClick={() => addSkill(skill)}
                                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 capitalize hover:bg-indigo-50 hover:text-indigo-700 cursor-pointer transition-colors duration-150"
                                    >
                                        <Plus className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" strokeWidth={2.5} />
                                        {skill}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="flex items-center justify-between px-4 py-3">
                                <p className="text-sm text-slate-400">No matches found.</p>
                                {query.trim() && (
                                    <button
                                        type="button"
                                        onClick={() => addSkill(query)}
                                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
                                    >
                                        Add "{query}"
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Selected skills */}
            {selectedSkills.length > 0 && (
                <div className="space-y-2">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                        {selectedSkills.length} skill{selectedSkills.length !== 1 ? 's' : ''} selected
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {selectedSkills.map((skill) => (
                            <span
                                key={skill}
                                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 capitalize"
                            >
                                {skill}
                                <button
                                    type="button"
                                    onClick={() => removeSkill(skill)}
                                    aria-label={`Remove ${skill}`}
                                    className="w-4 h-4 rounded-full flex items-center justify-center text-slate-400 hover:bg-red-100 hover:text-red-500 transition-all duration-150"
                                >
                                    <X className="w-2.5 h-2.5" strokeWidth={3} />
                                </button>
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Empty hint */}
            {selectedSkills.length === 0 && (
                <p className="text-xs text-slate-400 italic">
                    Search for skills or type a custom one and press Enter.
                </p>
            )}
        </div>
    );
};

export default JobSkills;