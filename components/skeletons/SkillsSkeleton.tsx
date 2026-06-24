'use client'

import { Skeleton } from "@/components/ui/skeleton"

const SkillsSkeleton = () => {
    return (
        <div className='flex flex-wrap gap-3'>
            <Skeleton className='w-[100px] rounded-full h-[30px] bg-neutral-200' />
            <Skeleton className='w-[100px] rounded-full h-[30px] bg-neutral-200' />
            <Skeleton className='w-[100px] rounded-full h-[30px] bg-neutral-200' />
            <Skeleton className='w-[100px] rounded-full h-[30px] bg-neutral-200' />
            <Skeleton className='w-[100px] rounded-full h-[30px] bg-neutral-200' />
            <Skeleton className='w-[100px] rounded-full h-[30px] bg-neutral-200' />
        </div>
    )
}

export default SkillsSkeleton