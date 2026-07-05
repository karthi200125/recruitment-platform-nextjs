export default function UserInfoSkeleton() {
    return (
        <div className="relative w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm animate-pulse">

            {/* Cover */}
            <div className="relative h-32 w-full bg-slate-200 sm:h-44">
                <div className="absolute right-3 top-3 h-8 w-8 rounded-lg bg-slate-300" />
            </div>

            <div className="px-5">

                {/* Avatar + Button */}
                <div className="-mt-10 mb-5 flex items-end justify-between gap-4 sm:-mt-14">

                    <div className="h-20 w-20 rounded-full border-4 border-white bg-slate-200 shadow-md sm:h-28 sm:w-28" />

                    <div className="h-10 w-32 rounded-xl bg-slate-200" />

                </div>

                {/* Name */}
                <div className="space-y-3 pb-6">

                    <div className="flex items-center gap-2">

                        <div className="h-7 w-52 rounded-lg bg-slate-200" />

                        <div className="h-5 w-16 rounded-full bg-slate-100" />

                    </div>

                    {/* Profession */}
                    <div className="h-4 w-36 rounded bg-slate-100" />

                    {/* Bio */}
                    <div className="space-y-2">

                        <div className="h-4 w-full rounded bg-slate-100" />

                        <div className="h-4 w-11/12 rounded bg-slate-100" />

                        <div className="h-4 w-8/12 rounded bg-slate-100" />

                    </div>

                    {/* Location */}
                    <div className="flex flex-wrap gap-4 pt-1">

                        <div className="h-4 w-40 rounded bg-slate-100" />

                        <div className="h-4 w-44 rounded bg-slate-100" />

                    </div>

                    {/* Followers */}
                    <div className="flex flex-wrap gap-3 pt-2">

                        <div className="h-9 w-32 rounded-lg bg-slate-100" />

                        <div className="h-9 w-32 rounded-lg bg-slate-100" />

                    </div>

                    {/* Premium Banner */}
                    <div className="mt-2 h-12 w-full rounded-xl bg-amber-100/60" />

                </div>

            </div>

        </div>
    );
}