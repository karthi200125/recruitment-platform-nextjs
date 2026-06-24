import { Skeleton } from '@/components/ui/skeleton';

export const UserProfileSkeleton = () => {
    return (
        <Skeleton className="w-[40px] h-[40px] rounded-full bg-neutral-200" />
    );
}

export const PremiumSkeleton = () => {
    return (
        <Skeleton className="w-[150px] rounded-full h-[40px] bg-neutral-200" />
    );
}

export const SearchSkeleton = () => {
    return (
        <Skeleton className="w-[300px] rounded-full h-[40px] bg-neutral-200" />
    );
}

export const NavIconSkeleton = () => {
    return (
        <div className='flex flex-xrow items-center gap-10'>
            <Skeleton className="w-[30px] rounded-full h-[30px] bg-neutral-200" />
            <Skeleton className="w-[30px] rounded-full h-[30px] bg-neutral-200" />
            <Skeleton className="w-[30px] rounded-full h-[30px] bg-neutral-200" />
            <Skeleton className="w-[30px] rounded-full h-[30px] bg-neutral-200" />
        </div>
    );
}
