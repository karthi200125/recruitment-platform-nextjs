import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

const MoreProfileSkeleton = () => {
    return (
        <div className='space-y-1'>
            {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className='flex flex-row items-start gap-5 borderb py-5'>
                    <Skeleton className='bg-neutral-200 h-10 w-10 rounded-full' />
                    <div className='space-y-2'>
                        <Skeleton className='bg-neutral-200 h-4 w-[150px] rounded-md' />
                        <Skeleton className='bg-neutral-200 h-3 w-[100px] rounded-md' />
                        <div className='flex flex-row items-center gap-3'>
                            <Skeleton className='bg-neutral-200 h-[40px] w-[100px] rounded-full' />
                            <Skeleton className='bg-neutral-200 h-[40px] w-[100px] rounded-full' />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default MoreProfileSkeleton