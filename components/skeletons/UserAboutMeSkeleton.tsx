import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

const UserAboutMeSkeleton = () => {
  return (
    <div className='space-y-1'>
      <Skeleton className='bg-neutral-200 w-[200px] h-[20px] rounded-full' />
      <Skeleton className='bg-neutral-200 w-[200px] h-[20px] rounded-full' />
      <Skeleton className='bg-neutral-200 w-full h-3 rounded-full' />
      <Skeleton className='bg-neutral-200 w-full h-3 rounded-full' />
      <Skeleton className='bg-neutral-200 w-full h-3 rounded-full' />
    </div>
  )
}

export default UserAboutMeSkeleton