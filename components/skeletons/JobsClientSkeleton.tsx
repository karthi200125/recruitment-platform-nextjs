
export function JobsClientSkeleton() {
    return (
        <div className="p-6 sm:p-8 max-w-3xl space-y-4">
            <div className="flex items-center justify-between mb-6 animate-pulse">
                <div className="space-y-2">
                    <div className="h-6 w-28 rounded-xl bg-slate-200" />
                    <div className="h-3.5 w-40 rounded-lg bg-slate-100" />
                </div>
                <div className="h-10 w-32 rounded-xl bg-slate-200" />
            </div>
            {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-2xl border border-slate-200 bg-white p-5 animate-pulse">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1">
                            <div className="w-11 h-11 rounded-xl bg-slate-200 flex-shrink-0" />
                            <div className="flex-1 space-y-2 pt-0.5">
                                <div className="h-4 w-2/3 rounded-lg bg-slate-200" />
                                <div className="h-3 w-1/3 rounded-lg bg-slate-100" />
                                <div className="flex gap-2 mt-2">
                                    <div className="h-5 w-16 rounded-full bg-slate-100" />
                                    <div className="h-5 w-24 rounded-full bg-slate-100" />
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-2 flex-shrink-0">
                            <div className="h-8 w-24 rounded-xl bg-slate-100" />
                            <div className="h-4 w-4 rounded bg-slate-100" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
