'use client';

import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from '@/components/ui/sheet';

import { signOut } from 'next-auth/react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';

import { BsFillBuildingsFill } from 'react-icons/bs';
import { FaCrown } from 'react-icons/fa';
import { RiMenu3Line } from 'react-icons/ri';

import noAvatar from '../../public/noProfile.webp';

import Icon from '../Icon';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useProfileCardItems } from './UserProfileCard';

const Menu = () => {
    const { user, isLoading } = useCurrentUser();

    const router = useRouter();
    const pathname = usePathname();

    const [open, setOpen] = useState(false);

    const extraItems = [
        {
            id: 999,
            title: 'Companies',
            href: '/companies',
            visible: true,
            icon: <BsFillBuildingsFill size={20} />,
        },
    ];

    const profileItems = useProfileCardItems(user);

    const menuItems = [...extraItems, ...profileItems];

    const basePath = useMemo(() => {
        return pathname.startsWith('/userProfile')
            ? pathname.split('/').slice(0, 3).join('/')
            : pathname.split('/').slice(0, 2).join('/');
    }, [pathname]);

    const handleClick = useCallback(
        async (item: (typeof menuItems)[number]) => {
            setOpen(false);

            if (item.title === 'Sign Out') {
                await signOut({
                    callbackUrl: '/signin',
                });
                return;
            }

            router.push(item.href);
        },
        [router, menuItems]
    );

    if (isLoading || !user) return null;

    return (
        <div className="md:hidden w-[40px] h-[40px] rounded-md bg-white/10 flexcenter text-white">
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                    <button>
                        <RiMenu3Line size={25} />
                    </button>
                </SheetTrigger>

                <SheetContent className="w-[90%] h-screen space-y-5">
                    <div className="flex gap-3">
                        <div className="relative w-[50px] h-[50px] rounded-full overflow-hidden">
                            <Image
                                src={user.profileImage || noAvatar}
                                alt="User Profile"
                                fill
                                className="object-cover"
                            />
                        </div>

                        <div>
                            <h4 className="font-bold">{user.username}</h4>
                            <p className="text-xs text-neutral-400">{user.email}</p>
                        </div>
                    </div>

                    {user.isPro ? (
                        <button
                            onClick={() => {
                                setOpen(false);
                                router.push('/subscription');
                            }}
                            className="underline text-sm"
                        >
                            Premium Features
                        </button>
                    ) : (
                        <button
                            onClick={() => {
                                setOpen(false);
                                router.push('/subscription');
                            }}
                            className="w-full px-5 rounded-md h-[50px] flex items-center gap-3"
                        >
                            <Icon icon={<FaCrown size={20} />} title="Upgrade Premium" />
                        </button>
                    )}

                    <div className="space-y-1">
                        {menuItems
                            .filter((item) => item.visible)
                            .map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => handleClick(item)}
                                    className={`w-full flex items-center gap-4 p-3 rounded-md text-left hover:bg-neutral-100 ${basePath === item.href ? 'bg-neutral-100' : ''
                                        }`}
                                >
                                    {item.icon}
                                    <span>{item.title}</span>
                                </button>
                            ))}
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
};

export default Menu;