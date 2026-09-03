import { ResumeAnalysisData } from "@/types/resume-analysis";
import { Lightbulb } from "lucide-react";

export function SuggestionsCard({
    suggestions,
}: {
    suggestions: ResumeAnalysisData["suggestions"];
}) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                    <Lightbulb className="h-5 w-5" />
                </div>

                <div>
                    <h2 className="font-bold text-slate-900">
                        AI Suggestions
                    </h2>

                    <p className="text-xs text-slate-400">
                        Practical improvements based on your resume
                    </p>
                </div>
            </div>

            <div className="mt-5 divide-y divide-slate-100">
                {suggestions.map((item, index) => (
                    <div
                        key={`${item.title}-${index}`}
                        className="flex gap-4 py-4 first:pt-0 last:pb-0"
                    >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-sm font-bold text-violet-600">
                            {index + 1}
                        </div>

                        <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                                <h3 className="text-sm font-semibold text-slate-800">
                                    {item.title}
                                </h3>

                                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-slate-500">
                                    {item.priority}
                                </span>
                            </div>

                            <p className="mt-1 text-xs leading-5 text-slate-500">
                                {item.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}