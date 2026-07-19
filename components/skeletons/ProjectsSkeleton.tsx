export function ProjectsSkeleton() {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
                <div
                    key={i}
                    className="overflow-hidden rounded-2xl border border-neutral-200 bg-white"
                    aria-hidden="true"
                >
                    <div className="aspect-video w-full animate-pulse bg-neutral-100" />
                    <div className="space-y-2 p-4">
                        <div className="h-3.5 w-2/3 animate-pulse rounded-full bg-neutral-100" />
                        <div className="h-3 w-full animate-pulse rounded-full bg-neutral-100" />
                    </div>
                </div>
            ))}
        </div>
    );
}
