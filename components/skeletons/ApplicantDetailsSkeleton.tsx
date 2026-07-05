export function ApplicantDetailsSkeleton() {
    return (
        <div className="max-w-2xl space-y-6 p-6 sm:p-8">

            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <div className="h-12 w-12 rounded-full bg-slate-200 animate-pulse flex-shrink-0" />
                    <div className="space-y-2 pt-1">
                        <div className="h-5 w-40 rounded-md bg-slate-200 animate-pulse" />
                        <div className="h-3.5 w-52 rounded-md bg-slate-100 animate-pulse" />
                        <div className="h-6 w-24 rounded-full bg-slate-100 animate-pulse" />
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                    <div className="h-9 w-24 rounded-xl bg-slate-200 animate-pulse" />
                    <div className="h-9 w-24 rounded-xl bg-slate-100 animate-pulse" />
                </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-slate-100" />

            {/* Resume */}
            <div>
                <div className="mb-3 flex items-center gap-2">
                    <div className="h-4 w-4 rounded bg-slate-200 animate-pulse" />
                    <div className="h-4 w-20 rounded bg-slate-200 animate-pulse" />
                </div>
                <div className="h-[400px] w-full rounded-2xl border border-slate-200 bg-slate-100 animate-pulse" />
            </div>

            {/* Screening Answers */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                {/* Header */}
                <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-4">
                    <div className="h-4 w-4 rounded bg-slate-200 animate-pulse" />
                    <div className="h-4 w-36 rounded bg-slate-200 animate-pulse" />
                    <div className="ml-auto h-3 w-16 rounded bg-slate-100 animate-pulse" />
                </div>
                {/* Questions */}
                <div className="divide-y divide-slate-100">
                    {Array.from({ length: 3 }).map((_, index) => (
                        <div
                            key={index}
                            className="px-5 py-4"
                        >
                            <div className="mb-2 h-3.5 w-3/5 rounded bg-slate-200 animate-pulse" />
                            <div className="space-y-2">
                                <div className="h-3 w-full rounded bg-slate-100 animate-pulse" />
                                <div className="h-3 w-5/6 rounded bg-slate-100 animate-pulse" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}