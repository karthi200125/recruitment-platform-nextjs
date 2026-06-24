import { Skeleton } from '@/components/ui/skeleton';

const JobListsSkeleton = ({ isDash , count = 10 }: { isDash?: boolean , count?:number }) => {
    return (
        <div className={`space-y-1 w-full h-[500px] overflow-y-auto ${isDash && "grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-5"}`}>
            {Array.from({ length: count }).map((_, index) => (
                <div key={index} className="relative w-full max-h-max overflow-hidden bg-neutral- px-2 md:px-5 py-3 flex flex-row items-start justify-between gap-5">
                    <Skeleton className="w-[60px] h-[60px] bg-neutral-200" />
                    <div className="w-full h-full flex flex-col gap-1.5 items-start justify-between">
                        <Skeleton className='h-5 w-full bg-neutral-200' />
                        <Skeleton className='h-4 w-[90%] bg-neutral-200' />
                        <div className="flex flex-row gap-2 items-center justify-between">
                            <Skeleton className='h-5 w-5 bg-neutral-200' />
                            <Skeleton className='h-3 w-[100px] bg-neutral-200' />
                        </div>

                        <div className="flex flex-row gap-2 items-center justify-between">
                            <Skeleton className='h-5 w-5 bg-neutral-200' />
                            <Skeleton className='h-3 w-[100px] bg-neutral-200' />
                        </div>
                        <div className="flex flex-row gap-2 items-center justify-between">
                            <Skeleton className='h-5 w-[100px] bg-neutral-200' />
                            <Skeleton className='h-3 w-[100px] bg-neutral-200' />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default JobListsSkeleton;
