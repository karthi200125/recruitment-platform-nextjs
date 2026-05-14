'use client'

import { useCurrentUser } from '@/hooks/useCurrentUser';
import { NavIconSkeleton, UserProfileSkeleton } from '@/Skeletons/NavbarSkeletons';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { Suspense } from 'react';
import Logo from '../Logo';
import Menu from './Menu';
import JobsSearchBar from '../JobsSearchBar';
import Button from '../Button';

const NavIcons = dynamic(() => import('./NavIcons'), { suspense: true });
const UserProfileCard = dynamic(() => import('./UserProfileCard'), { suspense: true });

const Navbar = () => {

    const { user } = useCurrentUser()

    const router = useRouter()

    return (
        <div className={`rounded-none md:rounded-[10px] bg-black relative max-h-max`}>
            <nav
                className="
    sticky
    top-0
    left-0
    z-10
    flex
    h-[60px]
    w-full
    items-center
    gap-4
    rounded-xl
    bg-black
    px-2
    md:px-5
  "
            >
                {/* LEFT */}
                <div className="hidden md:flex flex-shrink-0 items-center">
                    <Logo />
                </div>

                {/* MOBILE MENU */}
                <div className="flex lg:hidden">
                    <Menu />
                </div>

                {/* CENTER */}
                <div className="hidden flex-1 justify-center lg:flex">
                    <JobsSearchBar className="w-full max-w-3xl" />
                </div>

                {/* RIGHT */}
                <div className="ml-auto hidden flex-shrink-0 items-center gap-5 sm:flex">

                    <Suspense fallback={<NavIconSkeleton />}>
                        <NavIcons />
                    </Suspense>

                    {!user && (
                        <div className="flex items-center gap-2 rounded-full bg-white/10 p-1">
                            <Button
                                onClick={() => router.push('/signin')}
                                className="bg-black"
                            >
                                Sign In
                            </Button>

                            <Button
                                onClick={() => router.push('/signup')}
                                className="bg-white !text-black"
                            >
                                Sign Up
                            </Button>
                        </div>
                    )}

                    <Suspense fallback={<UserProfileSkeleton />}>
                        <UserProfileCard />
                    </Suspense>
                </div>

            </nav>
        </div >
    );
};

export default Navbar;
