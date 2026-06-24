import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

const JobDescriptionSkeleton = () => {
    return (
        <div className='w-full p-5 space-y-5'>
            <Skeleton className='bg-neutral-200 h-5 w-[200px]' />
            <div className='space-y-1'>
                <Skeleton className='bg-neutral-200 h-3 w-full' />
                <Skeleton className='bg-neutral-200 h-3 w-full' />
                <Skeleton className='bg-neutral-200 h-3 w-full' />
                <Skeleton className='bg-neutral-200 h-3 w-full' />
                <Skeleton className='bg-neutral-200 h-3 w-full' />
            </div>
        </div>
    )
}

export default JobDescriptionSkeleton