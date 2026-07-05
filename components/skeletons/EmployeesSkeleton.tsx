"use client";

function EmployeeRowSkeleton() {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-3 animate-pulse">
            <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full bg-slate-200 flex-shrink-0" />

                {/* User info */}
                <div className="flex-1 min-w-0 space-y-2">
                    <div className="h-4 w-40 rounded-md bg-slate-200" />
                    <div className="h-3 w-28 rounded-md bg-slate-100" />
                </div>

                {/* Action button */}
                <div className="w-20 h-9 rounded-lg bg-slate-100" />
            </div>
        </div>
    );
}

interface SectionSkeletonProps {
    rows?: number;
}

function SectionSkeleton({
    rows = 3,
}: SectionSkeletonProps) {
    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between mb-5 animate-pulse">
                <div className="h-5 w-44 rounded-md bg-slate-200" />
                <div className="h-6 w-10 rounded-full bg-slate-100" />
            </div>

            {/* Employee rows */}
            <div className="space-y-3">
                {Array.from({ length: rows }).map((_, index) => (
                    <EmployeeRowSkeleton key={index} />
                ))}
            </div>
        </section>
    );
}

export default function EmployeesSkeleton() {
    return (
        <div className="w-full min-h-screen px-2 md:px-4 py-6 space-y-6">
            {/* Page Header */}
            <div className="space-y-2 animate-pulse">
                <div className="h-7 w-60 rounded-md bg-slate-200" />
                <div className="h-4 w-72 rounded-md bg-slate-100" />
            </div>

            {/* Two Sections */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <SectionSkeleton />
                <SectionSkeleton />
            </div>
        </div>
    );
}