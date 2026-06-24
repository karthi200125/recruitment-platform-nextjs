'use client';

import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from '@/components/ui/sheet';

import { signOut } from 'next-auth/react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

import { Building2, Crown, MenuIcon } from 'lucide-react';

import noAvatar from '@/public/noProfile.webp';

import { useCurrentUser } from '@/hooks/useCurrentUser';
import Icon from '../Icon';
import CtaButton from '../ui/CtaButton';
import { getProfileMenuItems } from './profile-menu-items';

type MenuItem = {
    id: number;
    title: string;
    href: string;
    visible: boolean;
    icon: React.ReactNode;
};


const Menu = () => {
    const { user } = useCurrentUser();

    const router = useRouter();
    const pathname = usePathname();

    const [open, setOpen] = useState(false);

    const extraItems: MenuItem[] = [
        {
            id: 9,
            title: 'Companies',
            href: '/companies',
            visible: true,
            icon: <Building2 size={20} />,
        },
    ];

    const items = getProfileMenuItems(user);

    const menuItems: MenuItem[] = [
        ...extraItems,
        ...items,
    ];

    const basePath =
        pathname.startsWith('/userProfile')
            ? pathname.split('/').slice(0, 3).join('/')
            : pathname.split('/').slice(0, 2).join('/');

    const handleNavigate = async (item: MenuItem) => {
        setOpen(false);

        if (item.title === 'Sign Out') {
            await signOut({
                callbackUrl: '/signin',
            });
            return;
        }

        router.push(item.href);
    };

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
                    className="flex h-screen w-full max-w-sm flex-col border-r border-white/10 bg-black px-0 text-white"
                >

                    {/* HEADER */}
                    <div className="border-b border-white/10 px-5 py-5">

                        {user ? (
                            <div className="flex items-center gap-3">

                                <div className="relative h-14 w-14 overflow-hidden rounded-full border border-white/10 bg-white/5">
                                    <Image
                                        src={user.profileImage || noAvatar}
                                        alt="User Profile"
                                        fill
                                        className="object-cover"
                                    />
                                </div>

                                <div className="min-w-0">
                                    <h4 className="truncate text-sm font-semibold">
                                        {user.username}
                                    </h4>

                                    <p className="truncate text-xs text-zinc-400">
                                        {user.email}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-3">

                                <CtaButton
                                    href="/signin"
                                    variant="secondary"
                                    className="
                                                    h-10
                                                    rounded-xl
                                                    px-4
                                                    text-xs
                                                    font-semibold
                                                "
                                >
                                    Sign In
                                </CtaButton>

                                <CtaButton
                                    href="/signup"
                                    variant="primary"
                                    className="
                                                    h-10
                                                    rounded-xl
                                                    px-4
                                                    text-xs
                                                    font-semibold
                                                "
                                >
                                    Create Account
                                </CtaButton>
                            </div>
                        )}
                    </div>

                    {/* PREMIUM CTA */}
                    {user && (
                        <div className="px-5 py-4">

                            {user.isPro ? (
                                <button
                                    onClick={() => {
                                        setOpen(false);
                                        router.push('/subscription');
                                    }}
                                    className="w-full rounded-2xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm font-medium text-amber-300 transition hover:bg-amber-500/15"
                                >
                                    Manage Premium
                                </button>
                            ) : (
                                <button
                                    onClick={() => {
                                        setOpen(false);
                                        router.push('/subscription');
                                    }}
                                    className="flex w-full items-center gap-3 rounded-2xl border border-indigo-500/20 bg-indigo-500/10 px-4 py-3 text-sm font-medium text-indigo-300 transition hover:bg-indigo-500/15"
                                >
                                    <Icon
                                        icon={<Crown size={18} />}
                                        title="Upgrade Premium"
                                    />
                                </button>
                            )}
                        </div>
                    )}

                    {/* MENU ITEMS */}
                    <div className="flex-1 space-y-1 overflow-y-auto px-3 py-2">

                        {menuItems
                            .filter((item) => item.visible)
                            .map((item) => {
                                const active = basePath === item.href;

                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => handleNavigate(item)}
                                        className={`flex w-full items-center gap-4 rounded-xl px-4 py-3 text-left text-sm font-medium transition-all duration-200 ${active
                                            ? 'bg-white text-black'
                                            : 'text-zinc-300 hover:bg-white/[0.06] hover:text-white'
                                            }`}
                                    >
                                        <span className="flex-shrink-0">
                                            {item.icon}
                                        </span>

                                        <span className="truncate">
                                            {item.title}
                                        </span>
                                    </button>
                                );
                            })}
                    </div>

                    {/* FOOTER */}
                    <div className="border-t border-white/10 px-5 py-4">
                        <p className="text-center text-xs text-zinc-500">
                            Built for modern hiring
                        </p>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
};

export default Menu;