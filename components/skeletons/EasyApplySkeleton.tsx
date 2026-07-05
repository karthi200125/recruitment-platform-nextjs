"use client";

function SkeletonLine({
    className = "",
}: {
    className?: string;
}) {
    return (
        <div
            className={`rounded-md bg-slate-200 animate-pulse ${className}`}
        />
    );
}

export default function EasyApplySkeleton() {
    return (
        <div className="flex w-full flex-col">

            {/* Progress */}
            <div className="sticky top-[60px] flex items-center gap-5 bg-white py-3">
                <div className="h-2 flex-1 rounded-full bg-slate-200 animate-pulse" />
                <SkeletonLine className="h-5 w-12" />
            </div>

            <div className="mt-5 space-y-6">

                {/* Heading */}
                <div className="space-y-2">
                    <SkeletonLine className="h-6 w-52" />
                    <SkeletonLine className="h-4 w-80 max-w-full bg-slate-100" />
                </div>

                {/* User Card */}
                <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5">
                    <div className="h-20 w-20 rounded-xl bg-slate-200 animate-pulse flex-shrink-0" />

                    <div className="flex-1 space-y-3">
                        <SkeletonLine className="h-5 w-40" />
                        <SkeletonLine className="h-4 w-56 bg-slate-100 max-w-full" />
                    </div>
                </div>

                {/* Form */}
                <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5">

                    <div className="space-y-2">
                        <SkeletonLine className="h-4 w-28" />
                        <div className="h-10 rounded-lg bg-slate-100 animate-pulse" />
                    </div>

                    <div className="space-y-2">
                        <SkeletonLine className="h-4 w-32" />
                        <div className="h-10 rounded-lg bg-slate-100 animate-pulse" />
                    </div>

                    <div className="flex justify-end">
                        <div className="h-10 w-24 rounded-lg bg-slate-200 animate-pulse" />
                    </div>

                </div>

            </div>

            {/* Notice */}
            <div className="mt-5 rounded-xl border border-slate-200 p-5 space-y-2">
                <SkeletonLine className="h-4 w-full bg-slate-100" />
                <SkeletonLine className="h-4 w-11/12 bg-slate-100" />
                <SkeletonLine className="h-4 w-3/4 bg-slate-100" />
            </div>

        </div>
    );
}