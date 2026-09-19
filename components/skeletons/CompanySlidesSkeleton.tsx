const CompanySlidesSkeleton = () => {
    return (
        <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white">

            {/* Header */}
            <div className="border-b border-slate-100 px-5 pt-5">

                <div className="flex items-center gap-3">
                    {/* Company logo */}
                    <div className="h-12 w-12 shrink-0 rounded-xl bg-slate-100 animate-pulse" />

                    {/* Company name */}
                    <div className="space-y-2">
                        <div className="h-4 w-36 rounded-md bg-slate-100 animate-pulse" />
                        <div className="h-3 w-24 rounded-md bg-slate-100 animate-pulse" />
                    </div>
                </div>

                {/* Tabs */}
                <div className="mt-5 flex gap-5 overflow-hidden">
                    <div className="h-8 w-20 rounded-md bg-slate-100 animate-pulse" />
                    <div className="h-8 w-24 rounded-md bg-slate-100 animate-pulse" />
                    <div className="h-8 w-16 rounded-md bg-slate-100 animate-pulse" />
                </div>
            </div>

            {/* Content */}
            <div className="space-y-4 p-5">

                {/* About heading */}
                <div className="h-4 w-16 rounded-md bg-slate-100 animate-pulse" />

                {/* About text */}
                <div className="space-y-2">
                    <div className="h-3 w-full rounded-md bg-slate-100 animate-pulse" />
                    <div className="h-3 w-[92%] rounded-md bg-slate-100 animate-pulse" />
                    <div className="h-3 w-[72%] rounded-md bg-slate-100 animate-pulse" />
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                    <div className="h-[82px] rounded-xl bg-slate-50 p-4">
                        <div className="h-3 w-20 rounded-md bg-slate-200 animate-pulse" />
                        <div className="mt-3 h-5 w-12 rounded-md bg-slate-200 animate-pulse" />
                    </div>

                    <div className="h-[82px] rounded-xl bg-slate-50 p-4">
                        <div className="h-3 w-16 rounded-md bg-slate-200 animate-pulse" />
                        <div className="mt-3 h-5 w-10 rounded-md bg-slate-200 animate-pulse" />
                    </div>
                </div>

            </div>
        </section>
    );
};

export default CompanySlidesSkeleton;