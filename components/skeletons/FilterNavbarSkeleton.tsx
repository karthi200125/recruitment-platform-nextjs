const FilterNavbarSkeleton = () => {
    return (
        <div className="w-full bg-white border-b border-slate-100 px-4 py-2.5 flex items-center gap-2 overflow-hidden">
            {/* Date Posted */}
            <div className="h-9 w-[100px] rounded-xl bg-slate-100 animate-pulse flex-shrink-0" />

            {/* Experience */}
            <div className="h-9 w-[92px] rounded-xl bg-slate-100 animate-pulse flex-shrink-0" />

            {/* Type */}
            <div className="h-9 w-[72px] rounded-xl bg-slate-100 animate-pulse flex-shrink-0" />

            {/* Location */}
            <div className="h-9 w-[88px] rounded-xl bg-slate-100 animate-pulse flex-shrink-0" />

            {/* Company */}
            <div className="h-9 w-[82px] rounded-xl bg-slate-100 animate-pulse flex-shrink-0" />

            {/* Easy Apply */}
            <div className="h-9 w-[98px] rounded-xl bg-slate-100 animate-pulse flex-shrink-0" />
        </div>
    );
};

export default FilterNavbarSkeleton;