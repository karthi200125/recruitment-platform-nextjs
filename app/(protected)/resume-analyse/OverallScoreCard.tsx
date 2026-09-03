import { ResumeAnalysisData } from "@/types/resume-analysis";
import { RefreshCw } from "lucide-react";
import { getScoreLabel, getScoreStatus } from "./ResumeAnalyseClient";

export function OverallScoreCard({
    analysis,
    onAnalyze,
    isAnalyzing,
}: {
    analysis: ResumeAnalysisData;
    onAnalyze: () => void;
    isAnalyzing: boolean;
}) {
    const score = analysis.overallScore;

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex h-full flex-col items-center gap-6 sm:flex-row">
                <div
                    className="flex h-36 w-36 shrink-0 items-center justify-center rounded-full"
                    style={{
                        background: `conic-gradient(#6366f1 ${score * 3.6}deg, #eef2ff 0deg)`,
                    }}
                >
                    <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full bg-white">
                        <span className="text-4xl font-bold text-slate-900">
                            {score}
                        </span>
                        <span className="text-xs font-medium text-slate-400">
                            /100
                        </span>
                    </div>
                </div>

                <div className="flex-1 text-center sm:text-left">
                    <p className="text-sm font-semibold text-slate-500">
                        Overall Score
                    </p>

                    <h2 className="mt-1 text-2xl font-bold text-slate-900">
                        {getScoreLabel(score)}
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                        {analysis.summary}
                    </p>

                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
                        <div
                            className="h-full rounded-full bg-indigo-600 transition-all"
                            style={{ width: `${score}%` }}
                        />
                    </div>

                    <div className="mt-2 flex items-center justify-between gap-3">
                        <span className="text-xs text-slate-400">
                            AI resume assessment
                        </span>

                        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-600">
                            {getScoreStatus(score)}
                        </span>
                    </div>

                    <button
                        type="button"
                        onClick={onAnalyze}
                        disabled={isAnalyzing}
                        className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 transition hover:text-indigo-700 disabled:opacity-50"
                    >
                        <RefreshCw className="h-3.5 w-3.5" />
                        Re-analyze
                    </button>
                </div>
            </div>
        </div>
    );
}