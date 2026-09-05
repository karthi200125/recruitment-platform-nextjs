"use client";

import { Suspense, useState } from "react";
import { useSession } from "next-auth/react";

import Logo from "../Logo";
import AuthButtons from "./AuthButtons";
import Menu from "./Menu";
import NavIcons from "./NavIcons";
import SearchModal from "./SearchModal";
import UserProfileCard from "./UserProfileCard";

import {
    NavIconSkeleton,
    UserProfileSkeleton,
} from "@/components/skeletons/NavbarSkeletons";
import { SessionUser } from "@/types";

interface NavbarProps {
    user: SessionUser | null;
}

const Navbar = ({ user: initialUser }: NavbarProps) => {
    const [searchOpen, setSearchOpen] = useState(false);

    const {
        data: session,
        status,
    } = useSession();

    const isSessionLoading = status === "loading";

    const user =
        session?.user
            ? ({
                ...initialUser,
                ...session.user,
            } as SessionUser)
            : status === "authenticated"
                ? initialUser
                : null;

    const isAuthenticated =
        status === "authenticated" && !!user?.id;

    return (
        <>
            <SearchModal
                open={searchOpen}
                onClose={() => setSearchOpen(false)}
            />

            <header className="sticky top-0 z-50 w-full rounded-lg pt-1 md:pt-0">
                <nav className="flex h-[60px] items-center gap-3 rounded-lg border-b border-white/10 bg-neutral-950 px-3 md:px-2">

                    {/* Logo */}
                    <div className="hidden shrink-0 items-center md:flex">
                        <Logo />
                    </div>

                    {/* Mobile Menu */}
                    <div className="flex lg:hidden">
                        <Menu />
                    </div>

                    {/* Search */}
                    <div className="flex flex-1 justify-center px-1 sm:px-4">
                        <button
                            type="button"
                            onClick={() =>
                                setSearchOpen(true)
                            }
                            aria-label="Open job search"
                            className="group flex h-[38px] w-full max-w-sm items-center gap-3 rounded-md border border-white/[0.09] bg-white/[0.07] px-1 transition-all duration-200 hover:border-white/[0.16] hover:bg-white/[0.11] sm:max-w-md md:px-3.5"
                        >
                            <span className="shrink-0 text-neutral-400 transition-colors duration-150 group-hover:text-neutral-300" />

                            <span className="flex-1 truncate text-left text-[13px] text-neutral-500 transition-colors duration-150 group-hover:text-neutral-400">
                                Job title, skills, company...
                            </span>

                            <span className="hidden shrink-0 items-center gap-1 sm:inline-flex">
                                <kbd className="inline-flex items-center rounded border border-white/10 bg-white/[0.07] px-1.5 py-0.5 text-[10px] font-mono leading-snug text-neutral-500">
                                    ⌘K
                                </kbd>
                            </span>
                        </button>
                    </div>

                    {/* Right */}
                    <div className="ml-auto flex shrink-0 items-center gap-3">

                        {/* Navigation icons */}
                        <Suspense
                            fallback={<NavIconSkeleton />}
                        >
                            <NavIcons />
                        </Suspense>

                        {/* Authentication */}
                        {isSessionLoading ? (
                            <UserProfileSkeleton />
                        ) : isAuthenticated ? (
                            <Suspense
                                fallback={
                                    <UserProfileSkeleton />
                                }
                            >
                                <UserProfileCard
                                    user={user}
                                />
                            </Suspense>
                        ) : (
                            <AuthButtons />
                        )}

                    </div>
                </nav>
            </header>
        </>
    );
};

export default Navbar;