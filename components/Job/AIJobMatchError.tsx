"use client";

import { Sparkles } from "lucide-react";

const AIJobMatchError = () => {
    return (
        <section
            aria-label="AI job match unavailable"
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
        >
            <div className="flex items-start gap-3">
                {/* Icon */}
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-slate-100">
                    <Sparkles
                        className="h-4 w-4 text-slate-500"
                        strokeWidth={2}
                    />
                </div>

                {/* Content */}
                <div className="min-w-0">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-800">
                            AI Match
                        </span>

                        <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500">
                            Unavailable
                        </span>
                    </div>

                    <p className="mt-1.5 text-xs leading-5 text-slate-500">
                        We couldn&apos;t calculate the AI match for this job
                        right now. You can still view the job normally.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default AIJobMatchError;