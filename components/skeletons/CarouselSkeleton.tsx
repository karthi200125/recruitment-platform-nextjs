'use client'

import {
    Carousel,
    CarouselContent, CarouselItem
} from '@/components/ui/carousel'
import { Skeleton } from '@/components/ui/skeleton'

const CarouselSkeleton = () => {
    return (
        <Carousel
            opts={{
                align: "start",
            }}
            className="w-full"
        >
            <CarouselContent className="w-full gap-5">
                {Array.from({ length: 5 }).map((_, index) => (
                    <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 rounded-[20px] p-5 space-y-5 max-h-max bg-neutral-100">
                        <Skeleton className='w-full h-[150px] bg-neutral-200 rounded-[20px]' />
                        <div className="space-y-2">
                            <Skeleton className='w-full h-[20px] bg-neutral-200 rounded-[20px]' />
                            <Skeleton className='w-[60%] h-3 bg-neutral-200 rounded-[20px]' />
                            <Skeleton className='w-full h-3 bg-neutral-200 rounded-[20px]' />
                            <Skeleton className='w-full h-3 bg-neutral-200 rounded-[20px]' />
                            <Skeleton className='w-full h-3 bg-neutral-200 rounded-[20px]' />
                            <Skeleton className='w-full h-3 bg-neutral-200 rounded-[20px]' />                            
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
        </Carousel>
    )
}

export default CarouselSkeleton