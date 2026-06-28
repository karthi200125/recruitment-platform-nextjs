"use client";

import { useEffect, useState } from "react";
import { HelpCircle, List, Plus, Type, X } from "lucide-react";

import { JobQuestionType } from "@/types";

interface JobQuestionProps {
    alreadyQuestions?: JobQuestionType[];
    onQuestions?: (questions: JobQuestionType[]) => void;
}

const TYPE_META = {
    text: {
        label: "Text Input",
        icon: Type,
        bg: "bg-indigo-50 text-indigo-700 border-indigo-200",
    },
    select: {
        label: "Multiple Choice",
        icon: List,
        bg: "bg-violet-50 text-violet-700 border-violet-200",
    },
} as const;

const JobQuestion = ({
    alreadyQuestions = [],
    onQuestions,
}: JobQuestionProps) => {
    const [questions, setQuestions] =
        useState<JobQuestionType[]>(alreadyQuestions);

    const [text, setText] =
        useState("");

    const [type, setType] =
        useState<JobQuestionType["type"]>("text");

    useEffect(() => {
        setQuestions(alreadyQuestions);
    }, [alreadyQuestions]);

    const handleQuestionsChange = (
        updatedQuestions: JobQuestionType[]
    ) => {
        setQuestions(updatedQuestions);
        onQuestions?.(updatedQuestions);
    };

    const addQuestion = () => {
        const trimmedQuestion = text.trim();

        if (!trimmedQuestion) {
            return;
        }

        handleQuestionsChange([
            ...questions,
            {
                id: crypto.randomUUID(),
                question: trimmedQuestion,
                required: true,
                type,
            },
        ]);

        setText("");
        setType("text");
    };

    const removeQuestion = (
        questionId: string
    ) => {
        handleQuestionsChange(
            questions.filter(
                (question) =>
                    question.id !== questionId
            )
        );
    };

    const handleKeyDown = (
        event: React.KeyboardEvent<HTMLInputElement>
    ) => {
        if (event.key === "Enter") {
            event.preventDefault();
            addQuestion();
        }
    };

    return (
        <div className="space-y-4">

            {/* Input */}
            <div className="flex flex-col gap-3 sm:flex-row">

                {/* Type */}
                <div className="flex flex-shrink-0 gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1">
                    {(Object.keys(TYPE_META) as JobQuestionType["type"][]).map(
                        (questionType) => {
                            const meta =
                                TYPE_META[
                                questionType
                                ];

                            const Icon =
                                meta.icon;

                            return (
                                <button
                                    key={
                                        questionType
                                    }
                                    type="button"
                                    onClick={() =>
                                        setType(
                                            questionType
                                        )
                                    }
                                    className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200 ${type ===
                                        questionType
                                        ? "border border-slate-200 bg-white text-slate-800 shadow-sm"
                                        : "text-slate-500 hover:text-slate-700"
                                        }`}
                                >
                                    <Icon
                                        className="h-3 w-3"
                                        strokeWidth={
                                            2
                                        }
                                    />
                                    {
                                        meta.label
                                    }
                                </button>
                            );
                        }
                    )}
                </div>

                {/* Question */}
                <input
                    type="text"
                    value={text}
                    onChange={(event) =>
                        setText(
                            event.target.value
                        )
                    }
                    onKeyDown={
                        handleKeyDown
                    }
                    placeholder="e.g. How many years of React experience do you have?"
                    className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/30"
                />

                {/* Add */}
                <button
                    type="button"
                    onClick={addQuestion}
                    disabled={!text.trim()}
                    className="inline-flex flex-shrink-0 items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    <Plus
                        className="h-4 w-4"
                        strokeWidth={
                            2.5
                        }
                    />
                    Add
                </button>
            </div>

            {/* Questions */}
            {questions.length > 0 ? (
                <div className="space-y-2">

                    <div className="flex items-center gap-2">
                        <HelpCircle
                            className="h-3.5 w-3.5 text-slate-400"
                            strokeWidth={2}
                        />

                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                            {questions.length}{" "}
                            question
                            {questions.length !==
                                1
                                ? "s"
                                : ""}{" "}
                            added
                        </p>
                    </div>

                    <ul className="space-y-2">
                        {questions.map(
                            (
                                question,
                                index
                            ) => {
                                const meta =
                                    TYPE_META[
                                    question
                                        .type
                                    ];

                                const Icon =
                                    meta.icon;

                                return (
                                    <li
                                        key={
                                            question.id
                                        }
                                        className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3"
                                    >
                                        <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-500">
                                            {index +
                                                1}
                                        </span>

                                        <p className="min-w-0 flex-1 truncate text-sm leading-snug text-slate-700">
                                            {
                                                question.question
                                            }
                                        </p>

                                        <span
                                            className={`hidden flex-shrink-0 items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold sm:inline-flex ${meta.bg}`}
                                        >
                                            <Icon
                                                className="h-3 w-3"
                                                strokeWidth={
                                                    2
                                                }
                                            />
                                            {
                                                meta.label
                                            }
                                        </span>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeQuestion(
                                                    question.id
                                                )
                                            }
                                            aria-label="Remove question"
                                            className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg text-slate-400 transition-all duration-200 hover:bg-red-50 hover:text-red-500"
                                        >
                                            <X
                                                className="h-3.5 w-3.5"
                                                strokeWidth={
                                                    2.5
                                                }
                                            />
                                        </button>
                                    </li>
                                );
                            }
                        )}
                    </ul>
                </div>
            ) : (
                <p className="text-xs italic text-slate-400">
                    Optional — add questions candidates must answer when applying.
                </p>
            )}
        </div>
    );
};

export default JobQuestion;