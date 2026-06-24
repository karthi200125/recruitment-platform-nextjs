import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

const JobCompanySkeleton = () => {
    return (
        <div className='w-full border rounded-[10px] min-h-[100px] p-5 space-y-5'>
            <Skeleton className='bg-neutral-200 rounded-full h-5 w-[200px]' />
            <div className='flex flex-row items-start justify-between'>
                <div className='flex flex-row items-start gap-5'>
                    <Skeleton className='bg-neutral-200 rounded-md w-[100px] h-[100px]' />
                    <div className='space-y-2'>
                        <Skeleton className='bg-neutral-200 rounded-full h-5 w-[150px]' />
                        <Skeleton className='bg-neutral-200 rounded-full h-3 w-[200px]' />
                        <Skeleton className='bg-neutral-200 rounded-full h-3 w-[100px]' />
                    </div>
                </div>
                <Skeleton className='bg-neutral-200 rounded-full w-[150px] h-10' />
            </div>
            <div className='space-y-1'>
                <Skeleton className='bg-neutral-200 rounded-full h-3 w-full' />
                <Skeleton className='bg-neutral-200 rounded-full h-3 w-full' />
                <Skeleton className='bg-neutral-200 rounded-full h-3 w-full' />
                <Skeleton className='bg-neutral-200 rounded-full h-3 w-full' />
            </div>
        </div>
    )
}

export default JobCompanySkeleton