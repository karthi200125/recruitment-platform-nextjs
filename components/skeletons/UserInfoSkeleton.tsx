import { Skeleton } from "@/components/ui/skeleton"

const UserInfoSkeleton = () => {
    return (
        <div className='relative mt-[130px] md:mt-[250px] w-full max-h-max p-5 space-y-2'>
            <Skeleton className="bg-neutral-200 rounded-full h-[20px] w-[200px]" />
            <Skeleton className="bg-neutral-200 rounded-full h-3 w-[70%]" />
            <Skeleton className="bg-neutral-200 rounded-full h-3 w-[70%]" />
            <Skeleton className="bg-neutral-200 rounded-full h-3 w-[70%]" />
            <Skeleton className="bg-neutral-200 rounded-full h-3 w-[200px]" />
            <Skeleton className="bg-neutral-200 rounded-full h-3 w-[150px]" />

            <div className='flex flex-row items-center gap-5'>
                <Skeleton className="bg-neutral-200 rounded-full h-5 w-[100px]" />
                <Skeleton className="bg-neutral-200 rounded-full h-5 w-[100px]" />
            </div>
            <div className='flex flex-row items-center gap-5'>
                <Skeleton className="bg-neutral-200 rounded-full h-[40px] w-[100px]" />
                <Skeleton className="bg-neutral-200 rounded-full h-[40px] w-[100px]" />
            </div>
        </div>
    )
}

export default UserInfoSkeleton