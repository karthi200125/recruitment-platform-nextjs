"use client";

import {
    AlertCircle,
    Check,
    ChevronDown,
    Info,
    Sparkles,
} from "lucide-react";
import { useMemo, useState } from "react";

export interface AIJobMatchResult {
    matchScore: number;
    matchedSkills: string[];
    missingSkills: string[];
    experienceMatch: boolean;
    summary: string;

    // Optional detailed breakdown.
    skillsScore?: number;
    experienceScore?: number;
    requirementsScore?: number;
    locationScore?: number;
    jobTypeScore?: number;
}

interface AIJobMatchProps {
    result: AIJobMatchResult;
    isLoading?: boolean;
}

const getScoreColor = (score: number) => {
    if (score >= 70) {
        return {
            text: "text-emerald-600",
            ring: "text-emerald-500",
            bar: "bg-emerald-500",
            soft: "bg-emerald-50",
            border: "border-emerald-200",
        };
    }

    if (score >= 40) {
        return {
            text: "text-amber-600",
            ring: "text-amber-500",
            bar: "bg-amber-500",
            soft: "bg-amber-50",
            border: "border-amber-200",
        };
    }

    return {
        text: "text-red-500",
        ring: "text-red-400",
        bar: "bg-red-400",
        soft: "bg-red-50",
        border: "border-red-200",
    };
};

const getMatchLabel = (score: number) => {
    if (score >= 85) return "Excellent Match";
    if (score >= 70) return "Strong Match";
    if (score >= 50) return "Good Match";
    if (score >= 40) return "Partial Match";
    return "Low Match";
};

const AIJobMatch = ({
    result,
    isLoading = false,
}: AIJobMatchProps) => {
    const [showDetails, setShowDetails] = useState(false);

    const score = Math.min(
        Math.max(Math.round(result.matchScore), 0),
        100
    );

    const colors = getScoreColor(score);

    const breakdown = useMemo(
        () => [
            {
                label: "Skills",
                score: result.skillsScore ?? score,
            },
            {
                label: "Experience",
                score: result.experienceScore ?? (
                    result.experienceMatch ? 100 : 50
                ),
            },
            {
                label: "Requirements",
                score: result.requirementsScore ?? score,
            },
            {
                label: "Location",
                score: result.locationScore ?? 100,
            },
            {
                label: "Job Type",
                score: result.jobTypeScore ?? 100,
            },
        ],
        [result, score]
    );

    if (isLoading) {
        return (
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-indigo-500" />

                    <span className="text-sm font-semibold text-slate-800">
                        AI Match
                    </span>

                    <Info className="h-3.5 w-3.5 text-slate-400" />
                </div>

                <div className="mt-5 animate-pulse">
                    <div className="h-2 w-full rounded-full bg-slate-100" />
                    <div className="mt-3 h-2 w-4/5 rounded-full bg-slate-100" />
                    <div className="mt-3 h-2 w-3/5 rounded-full bg-slate-100" />
                </div>

                <p className="mt-4 text-xs text-slate-400">
                    Analyzing your profile against this job...
                </p>
            </div>
        );
    }

    return (
        <section
            aria-label="AI job match"
            className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden"
        >
            {/* Header */}
            <div className="flex items-center justify-between gap-4 px-5 pt-4">
                <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50">
                        <Sparkles
                            className="h-4 w-4 text-amber-500"
                            strokeWidth={2}
                        />
                    </div>

                    <span className="text-sm font-bold text-slate-800">
                        AI Match
                    </span>

                    <Info
                        className="h-3.5 w-3.5 text-slate-400"
                        strokeWidth={2}
                    />
                </div>

                <button
                    type="button"
                    onClick={() => setShowDetails((value) => !value)}
                    className="group inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 transition-colors hover:text-indigo-600"
                >
                    <span>How is this calculated?</span>

                    <Info
                        className="h-3.5 w-3.5 text-slate-400 transition-colors group-hover:text-indigo-500"
                        strokeWidth={2}
                    />
                </button>
            </div>

            {/* Main content */}
            <div className="px-5 py-5">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-[150px_minmax(0,1fr)_minmax(220px,0.9fr)]">

                    {/* Score */}
                    <div className="flex flex-col items-center justify-center border-b border-slate-100 pb-5 md:border-b-0 md:border-r md:pb-0">
                        <div
                            className="relative flex h-[118px] w-[118px] items-center justify-center rounded-full"
                            style={{
                                background: `conic-gradient(
                  currentColor ${score * 3.6}deg,
                  #e2e8f0 ${score * 3.6}deg
                )`,
                            }}
                        >
                            {/* Inner circle */}
                            <div className="absolute inset-[9px] flex flex-col items-center justify-center rounded-full bg-white">
                                <span className="text-[34px] font-bold leading-none tracking-tight text-slate-900">
                                    {score}%
                                </span>
                            </div>
                        </div>

                        <span
                            className={`mt-4 text-sm font-bold ${colors.text}`}
                        >
                            {getMatchLabel(score)}
                        </span>
                    </div>

                    {/* Skills */}
                    <div className="min-w-0 md:border-r md:border-slate-100 md:pr-6">
                        <h3 className="text-sm font-bold text-slate-800">
                            Matched Skills
                        </h3>

                        <div className="mt-3 flex flex-wrap gap-2">
                            {result.matchedSkills.length > 0 ? (
                                result.matchedSkills.map((skill) => (
                                    <span
                                        key={`matched-${skill}`}
                                        className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50/50 px-2.5 py-1 text-xs font-medium text-emerald-700"
                                    >
                                        <Check
                                            className="h-3 w-3"
                                            strokeWidth={2.5}
                                        />

                                        {skill}
                                    </span>
                                ))
                            ) : (
                                <span className="text-xs text-slate-400">
                                    No strong skill matches found.
                                </span>
                            )}
                        </div>

                        {/* Divider */}
                        <div className="my-5 h-px bg-slate-100" />

                        <h3 className="text-sm font-bold text-slate-800">
                            Missing / Weaker Skills
                        </h3>

                        <div className="mt-3 flex flex-wrap gap-2">
                            {result.missingSkills.length > 0 ? (
                                result.missingSkills.map((skill) => (
                                    <span
                                        key={`missing-${skill}`}
                                        className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700"
                                    >
                                        <AlertCircle
                                            className="h-3 w-3"
                                            strokeWidth={2.2}
                                        />

                                        {skill}
                                    </span>
                                ))
                            ) : (
                                <span className="text-xs text-slate-400">
                                    No major skill gaps detected.
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Breakdown */}
                    <div className="min-w-0">
                        <h3 className="text-sm font-bold text-slate-800">
                            Breakdown
                        </h3>

                        <div className="mt-4 space-y-4">
                            {breakdown.map((item) => {
                                const itemScore = Math.min(
                                    Math.max(Math.round(item.score), 0),
                                    100
                                );

                                return (
                                    <div
                                        key={item.label}
                                        className="grid grid-cols-[90px_minmax(0,1fr)_34px] items-center gap-3"
                                    >
                                        <span className="text-xs font-medium text-slate-600">
                                            {item.label}
                                        </span>

                                        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                                            <div
                                                className="h-full rounded-full bg-emerald-500 transition-all duration-700 ease-out"
                                                style={{
                                                    width: `${itemScore}%`,
                                                }}
                                            />
                                        </div>

                                        <span className="text-right text-xs font-semibold text-slate-700">
                                            {itemScore}%
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Bottom divider */}
                <div className="my-5 h-px bg-slate-100" />

                {/* Summary + details */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 items-start gap-2">
                        <Sparkles
                            className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-500"
                            strokeWidth={2}
                        />

                        <p className="text-xs leading-5 text-slate-700">
                            {result.summary}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => setShowDetails((value) => !value)}
                        className="inline-flex flex-shrink-0 items-center justify-center gap-1.5 text-xs font-semibold text-indigo-600 transition-colors hover:text-indigo-700"
                    >
                        <span>
                            {showDetails
                                ? "Hide details"
                                : "Why this match?"}
                        </span>

                        <ChevronDown
                            className={`h-3.5 w-3.5 transition-transform duration-200 ${showDetails ? "rotate-180" : ""
                                }`}
                            strokeWidth={2}
                        />
                    </button>
                </div>

                {/* Explanation */}
                {showDetails && (
                    <div className="mt-4 rounded-xl border border-indigo-100 bg-indigo-50/40 p-4">
                        <div className="flex items-start gap-2">
                            <Info
                                className="mt-0.5 h-4 w-4 flex-shrink-0 text-indigo-500"
                                strokeWidth={2}
                            />

                            <div>
                                <p className="text-xs font-semibold text-slate-800">
                                    How your match was evaluated
                                </p>

                                <p className="mt-1.5 text-xs leading-5 text-slate-600">
                                    The match considers your skills, experience,
                                    job requirements, location, and other relevant
                                    information from your Jobify profile.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default AIJobMatch;