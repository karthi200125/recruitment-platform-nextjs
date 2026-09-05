"use client";

import { RefreshCw, WifiOff, Briefcase } from "lucide-react";
import Link from "next/link";

export default function OfflinePage() {
    return (
        <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
            <div className="w-full max-w-md space-y-8 text-center">

                {/* Icon */}
                <div className="flex justify-center">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-3xl bg-white border border-slate-200 shadow-sm flex items-center justify-center">
                            <WifiOff className="w-10 h-10 text-slate-400" strokeWidth={1.5} />
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-amber-100 border-2 border-white flex items-center justify-center">
                            <span className="text-sm">!</span>
                        </div>
                    </div>
                </div>

                {/* Text */}
                <div className="space-y-3">
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                        No internet connection
                    </h1>
                    <p className="text-sm text-slate-500 leading-relaxed max-w-sm mx-auto">
                        It looks like you&apos;re offline. Check your Wi-Fi or mobile data and try again.
                        Any Jobify pages you visited recently are still available.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                        type="button"
                        onClick={() => window.location.reload()}
                        className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 active:bg-indigo-700 transition-all duration-200 shadow-sm shadow-indigo-200 w-full sm:w-auto justify-center"
                    >
                        <RefreshCw className="w-4 h-4" strokeWidth={2.5} />
                        Try Again
                    </button>
                    <Link
                        href="/jobs"
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 w-full sm:w-auto justify-center"
                    >
                        <Briefcase className="w-4 h-4 text-slate-400" strokeWidth={1.75} />
                        Browse Cached Jobs
                    </Link>
                </div>

                {/* Hint */}
                <p className="text-xs text-slate-400">
                    Jobify saves recently visited pages for offline access.
                </p>
            </div>
        </main>
    );
}