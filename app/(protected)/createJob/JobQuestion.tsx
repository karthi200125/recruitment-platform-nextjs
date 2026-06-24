'use client';

import { useState } from 'react';
import { X, Plus, HelpCircle, Type, List } from 'lucide-react';

interface Question {
    id: number;
    question: string;
    type: 'input' | 'select';
}

interface JobQuestionProps {
    onQuestions?: (questions: Question[]) => void;
    alreadyQuestions?: Question[];
}

const TYPE_META = {
    input: { label: 'Text Input', icon: Type, bg: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    select: { label: 'Multiple Choice', icon: List, bg: 'bg-violet-50 text-violet-700 border-violet-200' },
};

let nextId = 1;

const JobQuestion = ({ onQuestions, alreadyQuestions }: JobQuestionProps) => {
    const [questions, setQuestions] = useState<Question[]>(alreadyQuestions ?? []);
    const [text, setText] = useState('');
    const [type, setType] = useState<'input' | 'select'>('input');

    const add = () => {
        const trimmed = text.trim();
        if (!trimmed) return;
        const updated = [...questions, { id: nextId++, question: trimmed, type }];
        setQuestions(updated);
        onQuestions?.(updated);
        setText('');
        setType('input');
    };

    const remove = (id: number) => {
        const updated = questions.filter((q) => q.id !== id);
        setQuestions(updated);
        onQuestions?.(updated);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') { e.preventDefault(); add(); }
    };

    return (
        <div className="space-y-4">

            {/* Input row */}
            <div className="flex flex-col sm:flex-row gap-3">
                {/* Type toggle */}
                <div className="flex rounded-xl border border-slate-200 bg-slate-50 p-1 gap-1 flex-shrink-0">
                    {(['input', 'select'] as const).map((t) => {
                        const meta = TYPE_META[t];
                        const Icon = meta.icon;
                        return (
                            <button
                                key={t}
                                type="button"
                                onClick={() => setType(t)}
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${type === t
                                        ? "bg-white border border-slate-200 text-slate-800 shadow-sm"
                                        : "text-slate-500 hover:text-slate-700"
                                    }`}
                            >
                                <Icon className="w-3 h-3" strokeWidth={2} />
                                {meta.label}
                            </button>
                        );
                    })}
                </div>

                {/* Question input */}
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="e.g. How many years of React experience do you have?"
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/30 transition-all duration-200"
                />

                <button
                    type="button"
                    onClick={add}
                    disabled={!text.trim()}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 flex-shrink-0"
                >
                    <Plus className="w-4 h-4" strokeWidth={2.5} />
                    Add
                </button>
            </div>

            {/* Question list */}
            {questions.length > 0 && (
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <HelpCircle className="w-3.5 h-3.5 text-slate-400" strokeWidth={2} />
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                            {questions.length} question{questions.length !== 1 ? 's' : ''} added
                        </p>
                    </div>

                    <ul className="space-y-2">
                        {questions.map((q, i) => {
                            const meta = TYPE_META[q.type];
                            const TypeIcon = meta.icon;
                            return (
                                <li
                                    key={q.id}
                                    className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3"
                                >
                                    {/* Number */}
                                    <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500 flex-shrink-0">
                                        {i + 1}
                                    </span>

                                    {/* Question text */}
                                    <p className="flex-1 text-sm text-slate-700 leading-snug min-w-0 truncate">
                                        {q.question}
                                    </p>

                                    {/* Type badge */}
                                    <span className={`hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full border flex-shrink-0 ${meta.bg}`}>
                                        <TypeIcon className="w-3 h-3" strokeWidth={2} />
                                        {meta.label}
                                    </span>

                                    {/* Remove */}
                                    <button
                                        type="button"
                                        onClick={() => remove(q.id)}
                                        aria-label="Remove question"
                                        className="w-6 h-6 rounded-lg flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all duration-200 flex-shrink-0"
                                    >
                                        <X className="w-3.5 h-3.5" strokeWidth={2.5} />
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}

            {/* Empty hint */}
            {questions.length === 0 && (
                <p className="text-xs text-slate-400 italic">
                    Optional — add questions candidates must answer when applying.
                </p>
            )}
        </div>
    );
};

export default JobQuestion;