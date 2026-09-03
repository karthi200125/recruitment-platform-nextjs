import { ResumeAnalysisData } from "@/types/resume-analysis";
import { AlertTriangle, CircleAlert } from "lucide-react";

export function ImproveCard({
    areas,
}: {
    areas: ResumeAnalysisData["areasToImprove"];
}) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                    <AlertTriangle className="h-5 w-5" />
                </div>

                <h2 className="font-bold text-slate-900">
                    Areas to Improve
                </h2>
            </div>

            <div className="mt-5 space-y-5">
                {areas.map((item, index) => (
                    <div key={`${item.title}-${index}`} className="flex gap-3">
                        <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />

                        <div>
                            <h3 className="text-sm font-semibold text-slate-800">
                                {item.title}
                            </h3>

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