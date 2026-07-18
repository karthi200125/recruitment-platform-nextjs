export function SkeletonRow() {
    return (
        <div className="flex items-start gap-3 py-3 animate-pulse">
            <div className="w-10 h-10 rounded-full bg-slate-200 flex-shrink-0" />
            <div className="flex-1 space-y-2 pt-0.5">
                <div className="h-3.5 w-2/3 rounded-lg bg-slate-200" />
                <div className="h-3 w-1/2 rounded-lg bg-slate-100" />
                <div className="flex gap-2 mt-1">
                    <div className="h-7 w-20 rounded-xl bg-slate-100" />
                    <div className="h-7 w-20 rounded-xl bg-slate-100" />
                </div>
            </div>
        </div>
    );
}