export function JobStatusDetailsSkeleton() {
    return (
        <div className="p-8 space-y-7 animate-pulse">
            <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-slate-200 flex-shrink-0" />
                <div className="flex-1 space-y-2 pt-0.5">
                    <div className="h-5 w-2/3 rounded-xl bg-slate-200" />
                    <div className="h-3.5 w-1/3 rounded-lg bg-slate-100" />
                    <div className="flex gap-2 mt-1">
                        <div className="h-6 w-24 rounded-full bg-slate-100" />
                        <div className="h-6 w-16 rounded-full bg-slate-100" />
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
                <div className="h-20 rounded-2xl bg-slate-100" />
                <div className="h-20 rounded-2xl bg-slate-100" />
            </div>
            <div className="rounded-2xl border border-slate-200 p-6 space-y-5">
                <div className="h-4 w-40 rounded bg-slate-200" />
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex-shrink-0" />
                        <div className="space-y-1.5 flex-1 pt-1">
                            <div className="h-3.5 w-24 rounded bg-slate-200" />
                            <div className="h-3 w-36 rounded bg-slate-100" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
