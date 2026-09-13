import type { Metadata } from "next";
import Link from "next/link";
import { Home, Search } from "lucide-react";
import GoBackButton from "@/components/GoBackButton";

export const metadata: Metadata = {
    title: "Page Not Found | Jobify",
    description: "The page you're looking for could not be found on Jobify.",
    robots: {
        index: false,
        follow: false,
    },
};

export default function NotFound() {
    return (
        <main
            className="flex min-h-screen items-center justify-center px-4"
            aria-labelledby="not-found-title"
        >
            <div className="w-full max-w-lg space-y-8 text-center">

                {/* 404 visual */}
                <div
                    className="relative select-none"
                    aria-hidden="true"
                >
                    <span className="text-[9rem] font-black leading-none tracking-tighter text-slate-100">
                        404
                    </span>

                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-indigo-100 bg-indigo-50 shadow-sm">
                            <Search
                                className="h-7 w-7 text-indigo-400"
                                strokeWidth={1.5}
                            />
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-3">
                    <h1
                        id="not-found-title"
                        className="text-2xl font-bold tracking-tight text-slate-900"
                    >
                        Page not found
                    </h1>

                    <p className="mx-auto max-w-sm text-sm leading-relaxed text-slate-500">
                        The page you&apos;re looking for doesn&apos;t exist or may
                        have been moved. Let&apos;s get you back on track.
                    </p>
                </div>

                {/* Divider */}
                <div
                    className="mx-auto h-px w-12 bg-slate-200"
                    aria-hidden="true"
                />

                {/* Actions */}
                <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">

                    <Link
                        href="/"
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-200 transition-colors duration-200 hover:bg-indigo-500 sm:w-auto"
                    >
                        <Home
                            className="h-4 w-4"
                            strokeWidth={2}
                            aria-hidden="true"
                        />
                        Back to Home
                    </Link>

                    <GoBackButton />

                </div>

                <p className="text-xs text-slate-400">
                    Error 404 · Page not found
                </p>

            </div>
        </main>
    );
}