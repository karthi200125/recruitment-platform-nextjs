import { ResumeAnalysisData } from "@/types/resume-analysis";
import { Award, FileText, Target, TrendingUp } from "lucide-react";
import { getScoreStatus } from "./ResumeAnalyseClient";

const metricCards = [
    {
        key: "atsCompatibility",
        label: "ATS Compatibility",
        icon: FileText,
    },
    {
        key: "workExperience",
        label: "Work Experience",
        icon: Award,
    },
    {
        key: "skills",
        label: "Skills",
        icon: Target,
    },
    {
        key: "projects",
        label: "Projects",
        icon: TrendingUp,
    },
    {
        key: "structureAndClarity",
        label: "Structure & Clarity",
        icon: FileText,
    },
] as const;

export function MetricsGrid({
    metrics,
}: {
    metrics: ResumeAnalysisData["metrics"];
}) {
    return (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {metricCards.map((metric) => {
                const score = metrics[metric.key];
                const Icon = metric.icon;

                return (
                    <div
                        key={metric.key}
                        className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                    >
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                            <Icon className="h-5 w-5" />
                        </div>

                        <div className="mt-4 flex items-end gap-1">
                            <span className="text-2xl font-bold text-slate-900">
                                {score}
                            </span>
                            <span className="mb-1 text-xs text-slate-400">
                                /100
                            </span>
                        </div>

                        <p className="mt-1 text-xs font-semibold text-slate-700">
                            {metric.label}
                        </p>

                        <p className="mt-1 text-[11px] font-semibold text-indigo-600">
                            {getScoreStatus(score)}
                        </p>

                        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
                            <div
                                className="h-full rounded-full bg-indigo-500"
                                style={{ width: `${score}%` }}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}