import Link from "next/link";
import { Home, ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="w-full max-w-lg text-center space-y-8">

                {/* Large 404 */}
                <div className="relative select-none">
                    <span className="text-[9rem] font-black text-slate-100 leading-none tracking-tighter">
                        404
                    </span>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shadow-sm">
                            <Search className="w-7 h-7 text-indigo-400" strokeWidth={1.5} />
                        </div>
                    </div>
                </div>

                {/* Text */}
                <div className="space-y-3">
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                        Page not found
                    </h1>
                    <p className="text-sm text-slate-500 leading-relaxed max-w-sm mx-auto">
                        The page you're looking for doesn't exist or may have been moved.
                        Let's get you back on track.
                    </p>
                </div>

                {/* Divider */}
                <div className="w-12 h-px bg-slate-200 mx-auto" />

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Link
                        href="/jobs"
                        className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors duration-200 shadow-sm shadow-indigo-200 w-full sm:w-auto justify-center"
                    >
                        <Home className="w-4 h-4" strokeWidth={2} />
                        Back to Home
                    </Link>
                    <Link
                        href="javascript:history.back()"
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 w-full sm:w-auto justify-center"
                    >
                        <ArrowLeft className="w-4 h-4" strokeWidth={2} />
                        Go Back
                    </Link>
                </div>

                {/* Subtle footer note */}
                <p className="text-xs text-slate-400">
                    Error 404 · Page not found
                </p>
            </div>
        </div>
    );
}