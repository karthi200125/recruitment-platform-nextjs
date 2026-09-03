import { ExternalLink, FileText, Loader2, Sparkles } from "lucide-react";

export function EmptyAnalysisState({
    resume,
    isAnalyzing,
    onAnalyze,
}: {
    resume: string;
    isAnalyzing: boolean;
    onAnalyze: () => void;
}) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="grid items-center gap-8 lg:grid-cols-[1fr_1.3fr]">
                <div className="flex items-center gap-5 rounded-2xl bg-slate-50 p-5">
                    <div className="flex h-24 w-20 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white">
                        <FileText className="h-9 w-9 text-indigo-500" />
                    </div>

                    <div className="min-w-0">
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                            Your Resume
                        </p>

                        <h2 className="mt-1 truncate text-base font-bold text-slate-900">
                            My Resume.pdf
                        </h2>

                        <p className="mt-1 text-xs text-slate-500">
                            Ready for AI analysis
                        </p>

                        <a
                            href={resume}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                        >
                            View Resume
                            <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                    </div>
                </div>

                <div className="text-center lg:text-left">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                        <Sparkles className="h-6 w-6" />
                    </div>

                    <h2 className="mt-4 text-2xl font-bold text-slate-900">
                        Get your AI resume score
                    </h2>

                    <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500 lg:mx-0">
                        Analyze your ATS compatibility, skills, experience,
                        projects, structure, strengths, and areas that need improvement.
                    </p>

                    <button
                        type="button"
                        onClick={onAnalyze}
                        disabled={isAnalyzing}
                        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isAnalyzing ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Sparkles className="h-4 w-4" />
                        )}

                        {isAnalyzing
                            ? "Analyzing your resume..."
                            : "Analyze Resume"}
                    </button>

                    <p className="mt-3 text-[11px] text-slate-400">
                        Your analysis is generated live using AI.
                    </p>
                </div>
            </div>
        </div>
    );
}

