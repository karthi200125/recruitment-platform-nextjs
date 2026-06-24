import { Skeleton } from "@/components/ui/skeleton"

const ExperiencesSkeleton = () => {
    return (
        <div className="space-y-5">
            <div className='relative flex flex-row gap-5 items-start min-h-[100px]'>
                <Skeleton className="bg-neutral-200 w-[50px] h-[50px] rounded-md" />
                <div className="space-y-1">
                    <Skeleton className="bg-neutral-200 w-[200px] h-[20px] rounded-full" />
                    <Skeleton className="bg-neutral-200 w-[180px] h-3 rounded-full" />
                    <Skeleton className="bg-neutral-200 w-[150px] h-3 rounded-full" />
                    <Skeleton className="bg-neutral-200 w-[100px] h-3 rounded-full" />
                </div>
            </div>
            <div className='relative flex flex-row gap-5 items-start min-h-[100px]'>
                <Skeleton className="bg-neutral-200 w-[50px] h-[50px] rounded-md" />
                <div className="space-y-1">
                    <Skeleton className="bg-neutral-200 w-[200px] h-[20px] rounded-full" />
                    <Skeleton className="bg-neutral-200 w-[180px] h-3 rounded-full" />
                    <Skeleton className="bg-neutral-200 w-[150px] h-3 rounded-full" />
                    <Skeleton className="bg-neutral-200 w-[100px] h-3 rounded-full" />
                </div>
            </div>
        </div>
    )
}

export default ExperiencesSkeleton