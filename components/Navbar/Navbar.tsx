'use client'

import { useCurrentUser } from '@/hooks/useCurrentUser';
import { NavIconSkeleton, UserProfileSkeleton } from '@/Skeletons/NavbarSkeletons';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { Suspense } from 'react';
import Logo from '../Logo';
import Menu from './Menu';

const NavIcons = dynamic(() => import('./NavIcons'), { suspense: true });
const UserProfileCard = dynamic(() => import('./UserProfileCard'), { suspense: true });

const Navbar = () => {

    const { user } = useCurrentUser()

    const router = useRouter()

    return (
        <div className={`rounded-none md:rounded-[10px] bg-black relative top-1 max-h-max`}>
            <nav
                className={`sticky top-0 md:top-1 left-0 bg-black px-2 md:px-5 z-10 w-full h-[55px] flex flex-row items-center justify-between rounded-xl`}                
            >
                <Logo />

                

                <div className="hidden sm:flex flex-row items-center gap-5">
                    <Suspense fallback={<NavIconSkeleton />}>
                        <NavIcons />
                    </Suspense>
                    <Suspense fallback={<UserProfileSkeleton />}>
                        <UserProfileCard />
                    </Suspense>                    
                </div>
                <Menu />
            </nav>
        </div >
    );
};

export default Navbar;
