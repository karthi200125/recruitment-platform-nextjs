'use client';

import dynamic from 'next/dynamic';
import { Suspense, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { NavIconSkeleton, UserProfileSkeleton } from '@/Skeletons/NavbarSkeletons';
import Logo from '../Logo';
import Menu from './Menu';
import JobsSearchBar from '../JobsSearchBar';
import Button from '../Button';
import { openModal } from '@/app/Redux/ModalSlice';

const NavIcons = dynamic(() => import('./NavIcons'), { suspense: true });
const UserProfileCard = dynamic(() => import('./UserProfileCard'), { suspense: true });

/* ─────────────────────────────────────────────
   Inline SVG Icons (no extra deps)
───────────────────────────────────────────── */
const SearchIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
    </svg>
);

const CloseIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 6 6 18M6 6l12 12" />
    </svg>
);

const KbdIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M8 8h.01M12 8h.01M16 8h.01M8 12h.01M12 12h.01M16 12h.01M8 16h8" />
    </svg>
);

/* ─────────────────────────────────────────────
   Search Modal
───────────────────────────────────────────── */
const SearchModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
    const overlayRef = useRef<HTMLDivElement>(null);

    // Close on Escape
    useEffect(() => {
        if (!open) return;
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', handler);
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', handler);
            document.body.style.overflow = '';
        };
    }, [open, onClose]);

    // Click backdrop to close
    const handleBackdrop = (e: React.MouseEvent) => {
        if (e.target === overlayRef.current) onClose();
    };

    if (!open) return null;

    return (
        <div
            ref={overlayRef}
            onClick={handleBackdrop}
            className="fixed inset-0 z-[999] flex items-start justify-center px-4 pt-[80px] sm:pt-[100px] bg-black/60 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-label="Search jobs"
        >
            {/* Modal Panel */}
            <div className="w-full max-w-sm sm:max-w-2xl md:max-w-3xl xl:max-w-5xl bg-white rounded-2xl shadow-2xl animate-in fade-in slide-in-from-top-4 duration-200">

                {/* Header */}
                <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-neutral-100">
                    <div>
                        <h2 className="text-base font-semibold text-neutral-900 leading-tight">
                            Find your next role
                        </h2>
                        <p className="text-xs text-neutral-400 mt-0.5">
                            Search thousands of open positions
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        aria-label="Close search"
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors duration-150"
                    >
                        <CloseIcon />
                    </button>
                </div>

                {/* Search Bar */}
                <div className="px-5 py-5">
                    <JobsSearchBar className="w-full" />
                </div>


                {/* Footer hint */}
                <div className="flex items-center justify-between px-5 py-3 bg-neutral-50 border-t border-neutral-100">
                    <div className="flex items-center gap-3 text-[11px] text-neutral-400">
                        <span className="flex items-center gap-1">
                            <kbd className="inline-flex items-center bg-white border border-neutral-200 rounded px-1.5 py-0.5 text-[10px] font-mono text-neutral-500 leading-snug">↵</kbd>
                            search
                        </span>
                        <span className="flex items-center gap-1">
                            <kbd className="inline-flex items-center bg-white border border-neutral-200 rounded px-1.5 py-0.5 text-[10px] font-mono text-neutral-500 leading-snug">esc</kbd>
                            close
                        </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-neutral-400">
                        <KbdIcon />
                        <span>Powered by search</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

/* ─────────────────────────────────────────────
   Navbar
───────────────────────────────────────────── */
const Navbar = () => {
    const { user } = useCurrentUser();
    const router = useRouter();
    const dispatch = useDispatch();
    const [searchOpen, setSearchOpen] = useState(false);

    // Also support legacy Redux modal if needed
    const openSearch = () => {
        setSearchOpen(true);
        dispatch(openModal('searchBarModel'));
    };

    return (
        <>
            {/* Search Modal */}
            <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />

            {/* Navbar wrapper */}
            <div className="sticky top-0 left-0 z-50 w-full">
                <nav className="flex h-[60px] w-full items-center gap-3 bg-neutral-950 px-3 md:px-5 border-b border-white/[0.06]">

                    {/* ── LEFT: Logo ── */}
                    <div className="hidden flex-shrink-0 items-center md:flex">
                        <Logo />
                    </div>

                    {/* ── MOBILE: Hamburger ── */}
                    <div className="flex lg:hidden">
                        <Menu />
                    </div>

                    {/* ── CENTER: Search Trigger ── */}
                    <div className="flex flex-1 justify-center px-2 sm:px-4">
                        <button
                            onClick={openSearch}
                            aria-label="Open job search"
                            className="group flex w-full max-w-sm sm:max-w-md items-center gap-3 rounded-xl bg-white/[0.07] hover:bg-white/[0.11] border border-white/[0.09] hover:border-white/[0.16] px-3.5 h-[38px] transition-all duration-200"
                        >
                            <span className="text-neutral-400 group-hover:text-neutral-300 transition-colors duration-150 shrink-0">
                                <SearchIcon />
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

                    {/* ── RIGHT: Nav Actions ── */}
                    <div className="ml-auto flex flex-shrink-0 items-center gap-3">

                        {/* Nav Icons (notifications, bookmarks, etc.) */}
                        <div className="hidden sm:flex items-center">
                            <Suspense fallback={<NavIconSkeleton />}>
                                <NavIcons />
                            </Suspense>
                        </div>

                        {/* Auth Buttons — shown only when logged out */}
                        {!user && (
                            <div className="hidden sm:flex items-center gap-1.5 rounded-xl bg-white/[0.07] border border-white/[0.09] p-1">
                                <Button
                                    onClick={() => router.push('/signin')}
                                    className="h-[30px] px-3 rounded-lg text-xs font-semibold bg-transparent text-neutral-300 hover:bg-white/10 hover:text-white transition-all duration-150 border-0"
                                >
                                    Sign In
                                </Button>
                                <Button
                                    onClick={() => router.push('/signup')}
                                    className="h-[30px] px-3 rounded-lg text-xs font-semibold bg-white text-neutral-900 hover:bg-neutral-100 transition-all duration-150 border-0 shadow-sm"
                                >
                                    Sign Up
                                </Button>
                            </div>
                        )}

                        {/* User Profile */}
                        <Suspense fallback={<UserProfileSkeleton />}>
                            <UserProfileCard />
                        </Suspense>
                    </div>
                </nav>
            </div>
        </>
    );
};

export default Navbar;