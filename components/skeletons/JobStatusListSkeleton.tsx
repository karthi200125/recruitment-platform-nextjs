export function JobStatusListSkeleton() {
    return (
        <div className="divide-y divide-slate-100">
            {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="p-4 animate-pulse">
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-200 flex-shrink-0" />
                        <div className="flex-1 space-y-2 pt-0.5">
                            <div className="h-3.5 w-3/4 rounded-lg bg-slate-200" />
                            <div className="h-3 w-1/2 rounded-lg bg-slate-100" />
                            <div className="h-5 w-20 rounded-full bg-slate-100 mt-1" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}