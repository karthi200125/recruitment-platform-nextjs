"use client";

import { analyzeResume } from "@/actions/ai/resume/analyze-resume";
import type { ResumeAnalysisData } from "@/types/resume-analysis";
import {
    ArrowLeft,
    CircleAlert,
    FileText,
    Loader2,
    RefreshCw,
    Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { AnalysisResult } from "./AnalysisResult";
import { EmptyAnalysisState } from "./EmptyAnalysisState";

interface ResumeAnalyseClientProps {
    resume: string | null;
}

export function getScoreLabel(score: number) {
    if (score >= 90) return "Excellent Resume!";
    if (score >= 80) return "Great Resume!";
    if (score >= 70) return "Good Resume";
    if (score >= 60) return "Needs Improvement";
    return "Needs Major Improvement";
}

export function getScoreStatus(score: number) {
    if (score >= 90) return "Excellent";
    if (score >= 80) return "Great";
    if (score >= 70) return "Good";
    if (score >= 60) return "Fair";
    return "Needs Work";
}

export default function ResumeAnalyseClient({
    resume,
}: ResumeAnalyseClientProps) {
    const [analysis, setAnalysis] = useState<ResumeAnalysisData | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAnalyze = async () => {
        if (isAnalyzing) return;

        setIsAnalyzing(true);
        setError(null);

        try {
            const result = await analyzeResume();

            if (!result.success || !result.data) {
                setError(result.error || "Unable to analyze your resume.");
                return;
            }

            setAnalysis(result.data);
        } catch (error: unknown) {
            console.error("[ANALYZE_RESUME]", error);

            const message =
                error instanceof Error ? error.message : String(error);

            if (
                message.includes("429") ||
                message.includes("too_many_requests") ||
                message.includes("quota") ||
                message.includes("Quota exceeded") ||
                message.includes("Resource has been exhausted")
            ) {
                setError(
                    "AI usage limit reached. Please try again in about 1 minute."
                );
                return;
            }

            setError(
                "Something went wrong while analyzing your resume. Please try again."
            );
        } finally {
            setIsAnalyzing(false);
        }
    };

    if (!resume) {
        return (
            <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
                <Link
                    href="/userProfile"
                    className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-indigo-600 transition hover:text-indigo-700"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Profile
                </Link>

                <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                        <FileText className="h-7 w-7" />
                    </div>

                    <h1 className="mt-5 text-xl font-bold text-slate-900">
                        Upload your resume first
                    </h1>

                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                        Upload a PDF resume from your profile before using the AI
                        resume analyzer.
                    </p>

                    <Link
                        href="/userProfile"
                        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
                    >
                        Go to Profile
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-full bg-slate-50/60">
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <Link
                            href="/userProfile"
                            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-indigo-600 transition hover:text-indigo-700"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Profile
                        </Link>

                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                                <Sparkles className="h-6 w-6" />
                            </div>

                            <div>
                                <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                                    Resume Analysis
                                </h1>
                                <p className="mt-1 text-sm text-slate-500">
                                    AI-powered feedback to help you build a stronger
                                    resume.
                                </p>
                            </div>
                        </div>
                    </div>

                    {analysis && (
                        <button
                            type="button"
                            onClick={handleAnalyze}
                            disabled={isAnalyzing}
                            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isAnalyzing ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <RefreshCw className="h-4 w-4" />
                            )}
                            {isAnalyzing
                                ? "Analyzing..."
                                : "Re-analyze Resume"}
                        </button>
                    )}
                </header>

                {error && (
                    <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                        <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                {!analysis ? (
                    <EmptyAnalysisState
                        isAnalyzing={isAnalyzing}
                        onAnalyze={handleAnalyze}
                        resume={resume}
                    />
                ) : (
                    <AnalysisResult
                        resume={resume}
                        analysis={analysis}
                        onAnalyze={handleAnalyze}
                        isAnalyzing={isAnalyzing}
                    />
                )}
            </div>
        </div>
    );
}