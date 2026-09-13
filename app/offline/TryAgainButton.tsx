'use client'

import { RefreshCw } from "lucide-react";

export default function TryAgainButton() {
    return (
        <button
            type="button"
            onClick={() => window.location.reload()}
            className="
                inline-flex w-full items-center justify-center
                gap-2 rounded-xl bg-indigo-600 px-6 py-2.5
                text-sm font-semibold text-white
                shadow-sm shadow-indigo-200
                transition-all duration-200
                hover:bg-indigo-500
                active:bg-indigo-700
                sm:w-auto
            "
        >
            <RefreshCw
                className="h-4 w-4"
                strokeWidth={2.5}
                aria-hidden="true"
            />

            Try Again
        </button>
    );
}