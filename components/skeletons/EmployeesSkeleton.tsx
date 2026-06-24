import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

const EmployeesSkeleton = ({ count }: { count?: number }) => {
    return (
        <div className='space-y-2 w-full'>
            {Array.from({ length: count || 8 }).map((_, i) => (
                <Skeleton key={i} className='bg-neutral-100 flex flex-row items-start gap-5 p-2 md:p-5 rounded-lg overflow-hidden' >
                    <Skeleton className="bg-neutral-200 rounded-lg object-cover h-[50px] w-[50px]" />
                    <div className='space-y-2'>
                        <Skeleton className="bg-neutral-200 h-[20px] w-full rounded-md" />
                        <Skeleton className="bg-neutral-200 h-[10px] w-[200px] rounded-md" />
                    </div>
                </Skeleton>
            ))}
        </div>
    )
}

export default EmployeesSkeleton