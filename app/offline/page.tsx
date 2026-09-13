import type { Metadata } from "next";
import Link from "next/link";
import {
    Briefcase,
    WifiOff,
} from "lucide-react";
import TryAgainButton from "./TryAgainButton";

export const metadata: Metadata = {
    title: "You're Offline",
    description:
        "You're currently offline. Check your internet connection and try again. Recently visited Jobify pages may still be available.",

    robots: {
        index: false,
        follow: false,
    },
};

export default function OfflinePage() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
            <div className="w-full max-w-md space-y-8 text-center">

                {/* Icon */}
                <div className="flex justify-center">
                    <div className="relative">
                        <div
                            className="
                                flex h-24 w-24 items-center justify-center
                                rounded-3xl border border-slate-200
                                bg-white shadow-sm
                            "
                        >
                            <WifiOff
                                className="h-10 w-10 text-slate-400"
                                strokeWidth={1.5}
                                aria-hidden="true"
                            />
                        </div>

                        <div
                            className="
                                absolute -bottom-2 -right-2
                                flex h-8 w-8 items-center justify-center
                                rounded-full border-2 border-white
                                bg-amber-100
                            "
                            aria-hidden="true"
                        >
                            <span className="text-sm">!</span>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-3">
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                        No internet connection
                    </h1>

                    <p className="mx-auto max-w-sm text-sm leading-relaxed text-slate-500">
                        It looks like you&apos;re offline. Check your Wi-Fi or
                        mobile data and try again. Any Jobify pages you visited
                        recently may still be available.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                    <TryAgainButton />

                    <Link
                        href="/jobs"
                        className="
                            inline-flex w-full items-center justify-center
                            gap-2 rounded-xl border border-slate-200
                            bg-white px-6 py-2.5 text-sm font-semibold
                            text-slate-700 transition-all duration-200
                            hover:border-slate-300 hover:bg-slate-50
                            sm:w-auto
                        "
                    >
                        <Briefcase
                            className="h-4 w-4 text-slate-400"
                            strokeWidth={1.75}
                            aria-hidden="true"
                        />

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