import { Skeleton } from "@/components/ui/skeleton"

const MessageBoxSkeleton = () => {
    return (
        <div className="h-full relative">

            <div className="w-full flex flex-row items-center justify-between border-b h-[90px] px-3">
                <div className='flex flex-row items-center gap-5'>
                    <Skeleton className="w-[40px] md:w-[60px] h-[40px] md:h-[60px] rounded-full bg-neutral-200" />
                    <div className="space-y-2">
                        <Skeleton className="h-5 bg-neutral-200 w-[200px]" />
                        <Skeleton className="h-5 bg-neutral-200 w-[200px]" />
                    </div>
                </div>
                <Skeleton className="h-[40px] bg-neutral-200 w-[40px] rounded-md" />
            </div>

            <div className='w-full flex flex-col gap-10 chatsh p-3'>
                <Skeleton className="h-full bg-neutral-200 w-full rounded-md" />
            </div>

            <div className="absolute bottom-0 md:bottom-3 left-0 w-full flex items-center justify-between gap-2 md:gap-5 px-3 border-t border-neutral-200 py-3 bg-white">
                <Skeleton className="h-[30px] bg-neutral-200 w-[30px] rounded-md" />
                <Skeleton className="h-[30px] bg-neutral-200 w-[30px] rounded-md" />
                <Skeleton className="h-[40px] bg-neutral-200 w-full rounded-md" />
                <Skeleton className="h-[40px] bg-neutral-200 w-[50px] md:w-[150px] rounded-full" />
            </div>
        </div>
    )
}

export default MessageBoxSkeleton