import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

const JobRecruiterSkeleton = () => {
    return (
        <div className='relative w-full border rounded-[10px] min-h-[100px] p-5 space-y-3'>
            <Skeleton className='bg-neutral-200 rounded-full h-5 w-[200px]' />
            <div className='w-full flex items-start justify-between'>
                <div className='flex flex-row items-start gap-5'>
                    <Skeleton className='bg-neutral-200 rounded-full h-[60px] w-[60px]' />
                    <div className='space-y-2'>
                        <Skeleton className='bg-neutral-200 rounded-full h-3 w-[150px]' />
                        <Skeleton className='bg-neutral-200 rounded-full h-3 w-[200px]' />
                        <Skeleton className='bg-neutral-200 rounded-full h-3 w-[100px]' />
                        <Skeleton className='bg-neutral-200 rounded-full h-3 w-[60px]' />
                    </div>
                </div>
                <Skeleton className='bg-neutral-200 rounded-full h-10 w-[150px]' />
            </div>
        </div>
    )
}

export default JobRecruiterSkeleton