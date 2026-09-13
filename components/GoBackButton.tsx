"use client";

import { ArrowLeft } from "lucide-react";

export default function GoBackButton() {
    return (
        <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 sm:w-auto"
        >
            <ArrowLeft
                className="h-4 w-4"
                strokeWidth={2}
                aria-hidden="true"
            />
            Go Back
        </button>
    );
}