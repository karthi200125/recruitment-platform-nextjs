import { ResumeAnalysisData } from "@/types/resume-analysis";
import { CheckCircle2 } from "lucide-react";

export function StrengthsCard({
    strengths,
}: {
    strengths: ResumeAnalysisData["strengths"];
}) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                    <CheckCircle2 className="h-5 w-5" />
                </div>

                <h2 className="font-bold text-slate-900">
                    Strengths
                </h2>
            </div>

            <div className="mt-5 space-y-5">
                {strengths.map((item, index) => (
                    <div key={`${item.title}-${index}`} className="flex gap-3">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />

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