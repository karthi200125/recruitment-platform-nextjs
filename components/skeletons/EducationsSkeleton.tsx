import { Skeleton } from "@/components/ui/skeleton"

const EducationsSkeleton = () => {
    return (
        <div className="space-y-5">
            <div className='relative flex flex-row gap-5 items-start min-h-[100px]'>
                <Skeleton className="bg-neutral-200 w-[50px] h-[50px] rounded-md" />
                <div className="space-y-1">
                    <Skeleton className="bg-neutral-200 w-52 h-[20px] rounded-full" />
                    <Skeleton className="bg-neutral-200 w-44 h-3 rounded-full" />
                    <Skeleton className="bg-neutral-200 w-40 h-3 rounded-full" />
                    <Skeleton className="bg-neutral-200 w-12 h-3 rounded-full" />
                </div>
            </div>
            <div className='relative flex flex-row gap-5 items-start min-h-[100px]'>
                <Skeleton className="bg-neutral-200 w-[50px] h-[50px] rounded-md" />
                <div className="space-y-1">
                    <Skeleton className="bg-neutral-200 w-52 h-[20px] rounded-full" />
                    <Skeleton className="bg-neutral-200 w-44 h-3 rounded-full" />
                    <Skeleton className="bg-neutral-200 w-40 h-3 rounded-full" />
                    <Skeleton className="bg-neutral-200 w-12 h-3 rounded-full" />
                </div>
            </div>
        </div>
    )
}

export default EducationsSkeleton