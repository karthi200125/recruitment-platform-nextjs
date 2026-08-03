'use client'

import { Suspense, useState } from 'react';
import Logo from '../Logo';

import AuthButtons from './AuthButtons';
import Menu from './Menu';
import NavIcons from './NavIcons';
import SearchModal from './SearchModal';
import UserProfileCard from './UserProfileCard';

import {
    NavIconSkeleton,
    UserProfileSkeleton,
} from '@/components/skeletons/NavbarSkeletons';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { Search } from 'lucide-react';
import Icon from '../Icon';

const Navbar = () => {

    const [searchOpen, setSearchOpen] = useState(false);
    const { isAuthenticated } = useCurrentUser();

    return (
        <>
            {/* Search Modal */}
            <SearchModal
                open={searchOpen}
                onClose={() => setSearchOpen(false)}
            />

            <header className="sticky top-0 z-50 w-full rounded-lg">

                <nav
                    className="
                        flex
                        h-[60px]
                        items-center
                        gap-3
                        rounded-lg
                        border-b
                        border-white/10
                        bg-neutral-950
                        px-3
                        md:px-2
                    "
                >
                    {/* Logo */}

                    <div className="hidden shrink-0 items-center md:flex">
                        <Logo />
                    </div>

                    {/* Mobile Menu */}

                    <div className="flex lg:hidden">
                        <Menu />
                    </div>

                    {/* Search */}

                    <div className="hidden md:flex flex-1 justify-center px-2 sm:px-4">
                        <button
                            onClick={() => setSearchOpen(true)}
                            aria-label="Open job search"
                            className="group flex w-full max-w-sm sm:max-w-md items-center gap-3 rounded-md bg-white/[0.07] hover:bg-white/[0.11] border border-white/[0.09] hover:border-white/[0.16] px-3.5 h-[38px] transition-all duration-200"
                        >
                            <span className="text-neutral-400 group-hover:text-neutral-300 transition-colors duration-150 shrink-0">

                            </span>
                            <span className="flex-1 text-left text-[13px] text-neutral-500 group-hover:text-neutral-400 transition-colors duration-150 truncate">
                                Job title, skills, company...
                            </span>
                            {/* Keyboard shortcut badge — desktop only */}
                            <span className="hidden sm:inline-flex items-center gap-1 shrink-0">
                                <kbd className="inline-flex items-center bg-white/[0.07] border border-white/10 rounded px-1.5 py-0.5 text-[10px] font-mono text-neutral-500 leading-snug">
                                    ⌘K
                                </kbd>
                            </span>
                        </button>
                    </div>

                    {/* Right */}
                    <div className="ml-auto flex shrink-0 items-center gap-3">

                        <div className="flex items-center flex-row">
                            <button
                                onClick={() => setSearchOpen(true)}
                                aria-label="Open job search"
                                className="flex md:hidden items-center w-[40px] h-[40px] justify-center"
                            >
                                <Icon
                                    icon={<Search strokeWidth={2} className='text-white/60 h-5 w-5' />}
                                />
                            </button>
                            <Suspense fallback={<NavIconSkeleton />}>
                                <NavIcons />
                            </Suspense>
                        </div>

                        {!isAuthenticated && <AuthButtons />}

                        <Suspense fallback={<UserProfileSkeleton />}>
                            <UserProfileCard />
                        </Suspense>

                    </div>

                </nav>

            </header>
        </>
    );
};

export default Navbar;
