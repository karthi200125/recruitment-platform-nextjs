'use client';

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

import { signOut } from 'next-auth/react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { Building2, ChevronRight, Crown, LogOut, MenuIcon, Sparkles, type LucideIcon } from 'lucide-react';

import noAvatar from '@/public/noProfile.webp';

import { useCurrentUser } from '@/hooks/useCurrentUser';
import AuthButtons from './AuthButtons';
import { getProfileMenuItems, ProfileMenuItem } from './profile-menu-items';

const ROLE_STYLES: Record<string, string> = {
    CANDIDATE: 'bg-sky-500/15 text-sky-300 border-sky-500/20',
    RECRUITER: 'bg-violet-500/15 text-violet-300 border-violet-500/20',
    ORGANIZATION: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/20',
};

const ROLE_LABELS: Record<string, string> = {
    CANDIDATE: 'Candidate',
    RECRUITER: 'Recruiter',
    ORGANIZATION: 'Organization',
};

const Menu = () => {
    const { user } = useCurrentUser();
    const router = useRouter();
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

    const menuItems: ProfileMenuItem[] = useMemo(() => {
        const companiesItem: ProfileMenuItem = {
            id: 100,
            title: 'Companies',
            href: '/companies',
            visible: true,
            icon: Building2,
        };

        return [companiesItem, ...getProfileMenuItems(user)].filter((item) => item.action !== 'signOut');
    }, [user]);

    const signOutItem = useMemo(
        () => getProfileMenuItems(user).find((item) => item.action === 'signOut'),
        [user]
    );

    const activeHref = useMemo(() => {
        const exact = menuItems.find((item) => item.href === pathname);
        if (exact) return exact.href;

        const prefixMatches = menuItems
            .filter((item) => item.href !== '/' && pathname.startsWith(item.href))
            .sort((a, b) => b.href.length - a.href.length);

        return prefixMatches[0]?.href ?? null;
    }, [menuItems, pathname]);

    const handleNavigate = (item: ProfileMenuItem) => {
        setOpen(false);
        router.push(item.href);
    };

    const handleSignOut = async () => {
        setOpen(false);
        await signOut({ callbackUrl: '/signin' });
    };

    const roleStyle = user?.role ? ROLE_STYLES[user.role] : undefined;
    const roleLabel = user?.role ? ROLE_LABELS[user.role] : undefined;

    return (
        <div className="flex items-center justify-center md:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                    <button
                        type="button"
                        aria-label="Open menu"
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white transition-all duration-200 hover:bg-white/[0.08] active:scale-95"
                    >
                        <MenuIcon className="h-5 w-5" />
                    </button>
                </SheetTrigger>

                <SheetContent
                    side="left"
                    className="flex h-screen w-full max-w-sm flex-col overflow-hidden border-r border-white/10 bg-neutral-950 px-0 text-white"
                >
                    <div className="pointer-events-none absolute -top-24 -left-24 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl" />

                    {/* HEADER */}
                    <div className="relative border-b border-white/10 px-5 py-2">
                        {user ? (
                            <div className="flex items-center gap-3.5">
                                <div
                                    className={`relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-full ${user.isPro
                                        ? 'ring-2 ring-amber-400/60 ring-offset-2 ring-offset-neutral-950'
                                        : 'ring-1 ring-white/10'
                                        }`}
                                >
                                    <Image src={user.profileImage || noAvatar} alt={user.username} fill className="object-cover" />
                                </div>

                                <div className="min-w-0 flex-1 space-y-1">
                                    <h4 className="truncate text-[15px] font-semibold leading-tight">{user.username}</h4>
                                    <p className="truncate text-xs text-zinc-500">{user.email}</p>
                                    {roleLabel && (
                                        <span
                                            className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold ${roleStyle}`}
                                        >
                                            {roleLabel}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <p className="text-sm text-zinc-400">Sign in to unlock your dashboard.</p>
                                <AuthButtons />
                            </div>
                        )}
                    </div>

                    {/* PREMIUM CTA */}
                    {user && (
                        <div className="relative px-5">
                            {user.isPro ? (
                                <button
                                    onClick={() => handleNavigate({ id: -1, title: '', href: '/subscription', visible: true, icon: Crown })}
                                    className="group flex w-full items-center gap-3 rounded-2xl border border-amber-500/20 bg-gradient-to-r from-amber-500/10 to-amber-500/5 px-4 py-3.5 text-left transition hover:border-amber-500/30 hover:from-amber-500/15"
                                >
                                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-300">
                                        <Crown size={17} strokeWidth={2} />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-semibold text-amber-200">Premium Member</p>
                                        <p className="text-xs text-amber-400/70">Manage your subscription</p>
                                    </div>
                                    <ChevronRight className="h-4 w-4 flex-shrink-0 text-amber-400/50 transition-transform group-hover:translate-x-0.5" />
                                </button>
                            ) : (
                                <button
                                    onClick={() => handleNavigate({ id: -1, title: '', href: '/subscription', visible: true, icon: Crown })}
                                    className="group relative w-full overflow-hidden rounded-2xl border border-indigo-500/20 bg-gradient-to-r from-indigo-500/15 via-violet-500/10 to-indigo-500/15 px-4 py-3.5 text-left transition hover:border-indigo-500/30"
                                >
                                    <div className="relative flex items-center gap-3">
                                        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-300">
                                            <Sparkles size={17} strokeWidth={2} />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-semibold text-indigo-200">Upgrade to Premium</p>
                                            <p className="text-xs text-indigo-400/70">Unlock unlimited applications</p>
                                        </div>
                                        <ChevronRight className="h-4 w-4 flex-shrink-0 text-indigo-400/50 transition-transform group-hover:translate-x-0.5" />
                                    </div>
                                </button>
                            )}
                        </div>
                    )}

                    {/* MENU ITEMS */}
                    <div className="relative flex-1 space-y-1 overflow-y-auto px-3 py-2">
                        <AnimatePresence>
                            {menuItems
                                .filter((item) => item.visible)
                                .map((item, index) => {
                                    const active = activeHref === item.href;
                                    const ItemIcon: LucideIcon = item.icon;

                                    return (
                                        <motion.button
                                            key={item.id}
                                            initial={{ opacity: 0, x: -8 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.2, delay: index * 0.03 }}
                                            onClick={() => handleNavigate(item)}
                                            className="relative flex w-full items-center gap-3.5 rounded-xl px-4 py-3 text-left text-sm font-medium"
                                        >
                                            {active && (
                                                <motion.span
                                                    layoutId="activeMenuPill"
                                                    className="absolute inset-0 rounded-xl bg-white"
                                                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                                                />
                                            )}

                                            <span
                                                className={`relative z-10 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg transition-colors ${active ? 'text-black' : 'text-zinc-400'
                                                    }`}
                                            >
                                                <ItemIcon className="h-[18px] w-[18px]" strokeWidth={1.75} />
                                            </span>

                                            <span className={`relative z-10 truncate transition-colors ${active ? 'text-black' : 'text-zinc-300'}`}>
                                                {item.title}
                                            </span>
                                        </motion.button>
                                    );
                                })}
                        </AnimatePresence>
                    </div>

                    {/* SIGN OUT — pinned separately, never mixed with nav items */}
                    {user && signOutItem && (
                        <div className="border-t border-white/10 px-3 py-2">
                            <button
                                onClick={handleSignOut}
                                className="flex w-full items-center gap-3.5 rounded-xl px-4 text-left text-sm font-medium text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
                            >
                                <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg">
                                    <LogOut className="h-[18px] w-[18px]" strokeWidth={1.75} />
                                </span>
                                <span>Sign Out</span>
                            </button>
                        </div>
                    )}

                </SheetContent>
            </Sheet>
        </div>
    );
};

export default Menu;