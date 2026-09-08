"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function AIJobMatchSkeleton() {
    return (
        <div className="w-full rounded-xl border bg-background p-4 sm:p-5">
            {/* Header */}
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />

                    <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24" />
                    </div>
                </div>

                <Skeleton className="h-8 w-16 rounded-full" />
            </div>

            {/* Match score */}
            <div className="mt-5 flex items-center gap-4">
                <Skeleton className="h-16 w-16 rounded-full" />

                <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-3 w-full max-w-sm" />
                    <Skeleton className="h-3 w-3/4 max-w-xs" />
                </div>
            </div>

            {/* Match details */}
            <div className="mt-5 space-y-3">
                <Skeleton className="h-4 w-36" />

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-5 w-5 rounded" />
                        <Skeleton className="h-3 w-28" />
                    </div>

                    <div className="flex items-center gap-2">
                        <Skeleton className="h-5 w-5 rounded" />
                        <Skeleton className="h-3 w-32" />
                    </div>

                    <div className="flex items-center gap-2">
                        <Skeleton className="h-5 w-5 rounded" />
                        <Skeleton className="h-5 w-5 rounded" />
                    </div>

                    <div className="flex items-center gap-2">
                        <Skeleton className="h-5 w-5 rounded" />
                        <Skeleton className="h-3 w-24" />
                    </div>
                </div>
            </div>

            {/* Skills */}
            <div className="mt-5 space-y-3">
                <Skeleton className="h-4 w-24" />

                <div className="flex flex-wrap gap-2">
                    <Skeleton className="h-7 w-20 rounded-full" />
                    <Skeleton className="h-7 w-24 rounded-full" />
                    <Skeleton className="h-7 w-16 rounded-full" />
                    <Skeleton className="h-7 w-28 rounded-full" />
                </div>
            </div>

            {/* Bottom explanation */}
            <div className="mt-5 space-y-2">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-11/12" />
                <Skeleton className="h-3 w-3/4" />
            </div>
        </div>
    );
}