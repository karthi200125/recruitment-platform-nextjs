'use client';

import { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import {
    Building2,
    BriefcaseBusiness,
    LayoutDashboard,
    MessageSquareMore,
} from 'lucide-react';

import Icon from '@/components/Icon';

import { useCurrentUser } from '@/hooks/useCurrentUser';
import { getUnreadMessagesCount } from '@/actions/message/get-unread-messages-count ';

interface NavItem {
    readonly id: number;
    readonly icon: React.ReactNode;
    readonly title: string;
    readonly href: string;
    readonly count?: number;
}

const NavIcons = () => {
    const pathname = usePathname();
    const { user } = useCurrentUser();

    const { data: unreadMessagesCount = 0 } = useQuery({
        queryKey: ['unread-messages-count', user?.id],

        queryFn: () =>
            user?.id
                ? getUnreadMessagesCount(user.id)
                : Promise.resolve(0),

        enabled: Boolean(user?.id),

        staleTime: 60 * 1000,
        gcTime: 5 * 60 * 1000,

        refetchOnWindowFocus: false,
    });

    const navItems = useMemo<ReadonlyArray<NavItem>>(
        () => [
            {
                id: 1,
                icon: <Building2 className="h-5 w-5" strokeWidth={2} />,
                title: 'Companies',
                href: '/companies',
            },
            {
                id: 2,
                icon: <BriefcaseBusiness className="h-5 w-5" strokeWidth={2} />,
                title: 'Jobs',
                href: '/jobs',
            },
            ...(user
                ? [
                    {
                        id: 3,
                        icon: (
                            <MessageSquareMore
                                className="h-5 w-5"
                                strokeWidth={2}
                            />
                        ),
                        title: 'Messages',
                        href: '/messages',
                        count: unreadMessagesCount,
                    },
                    {
                        id: 4,
                        icon: (
                            <LayoutDashboard
                                className="h-5 w-5"
                                strokeWidth={2}
                            />
                        ),
                        title: 'Dashboard',
                        href: '/dashboard',
                    },
                ]
                : []),
        ],
        [user, unreadMessagesCount]
    );

    return (
        <div className="flex items-center md:gap-3">
            {navItems.map((item) => {
                const isActive =
                    pathname === item.href ||
                    pathname.startsWith(`${item.href}/`);

                return (
                    <Icon
                        key={item.id}
                        href={item.href}
                        icon={item.icon}
                        title={item.title}
                        count={item.count}
                        isHover
                        tooltipBg="white"
                        className={`transition-all duration-200 ${isActive
                            ? '!bg-white/10 !text-white'
                            : '!text-neutral-500 hover:!bg-white/10 hover:!text-white'
                            }`}
                    />
                );
            })}
        </div>
    );
};

export default NavIcons;