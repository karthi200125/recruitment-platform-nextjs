import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

const JobTitlesSkeleton = () => {
    return (
        <div className='space-y-5'>
            <div className="flex flex-row items-center justify-between h-[50px]">
                <div className="flex flex-row items-center gap-2">
                    <Skeleton className='bg-neutral-200 h-5 w-5 rounded-md' />
                    <Skeleton className='bg-neutral-200 h-3 w-[100px] rounded-md' />
                </div>
                <Skeleton className='bg-neutral-200 h-8 w-8 rounded-md' />
            </div>

            <div className='space-y-3'>
                <Skeleton className='bg-neutral-200 h-6 w-[200px] rounded-full' />
                <Skeleton className='bg-neutral-200 h-3 w-full rounded-full' />
                <div className="flex flex-row gap-3 items-center">
                    <Skeleton className='bg-neutral-200 h-8 w-8 rounded-md' />
                    <Skeleton className='bg-neutral-200 h-8 w-[100px] rounded-md' />
                    <Skeleton className='bg-neutral-200 h-8 w-[100px] rounded-md' />
                </div>
                <div className="flex flex-row gap-3 items-center">
                    <Skeleton className='bg-neutral-200 h-8 w-8 rounded-md' />
                    <Skeleton className='bg-neutral-200 h-8 w-[150px] rounded-md' />
                </div>
                <div className="flex flex-row gap-3 items-center">
                    <Skeleton className='bg-neutral-200 h-8 w-8 rounded-md' />
                    <Skeleton className='bg-neutral-200 h-3 w-[200px] rounded-full' />
                </div>
                <div className="flex flex-row gap-3 items-center">
                    <Skeleton className='bg-neutral-200 h-8 w-8 rounded-md' />
                    <Skeleton className='bg-neutral-200 h-3 w-[200px] rounded-full' />
                </div>
                <div className="flex flex-row gap-3 items-center">
                    <Skeleton className='bg-neutral-200 h-10 w-[150px] rounded-full' />
                    <Skeleton className='bg-neutral-200 h-10 w-[100px] rounded-full' />
                </div>
            </div>
        </div>
    )
}

export default JobTitlesSkeleton