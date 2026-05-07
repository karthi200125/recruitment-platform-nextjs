'use client';


import { getUnreadMessagesCount } from '@/actions/message/getUnreadMessagesCount ';
import Icon from '@/components/Icon';
import { useCurrentUser } from '@/hooks/useCurrentUser';

import { useQuery } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';

import { BsFillBuildingsFill } from 'react-icons/bs';
import { FaSuitcase } from 'react-icons/fa';
import { MdDashboard } from 'react-icons/md';
import { RiMessage3Fill } from 'react-icons/ri';

interface NavItem {
    id: number;
    icon: React.ReactNode;
    title: string;
    href: string;
    count?: number;
    isCount?: boolean;
    protected?: boolean;
}

const NavIcons = () => {
    const pathname = usePathname();

    const { user } = useCurrentUser();

    const { data: unreadMessagesCount = 0 } = useQuery({
        queryKey: ['unread-messages-count', user?.id],

        queryFn: async () => {
            if (!user?.id) return 0;

            return await getUnreadMessagesCount(user.id);
        },

        enabled: Boolean(user?.id),

        staleTime: 1000 * 60,
        gcTime: 1000 * 60 * 5,

        refetchOnWindowFocus: false,
    });

    const navItems: NavItem[] = [
        {
            id: 1,
            icon: <BsFillBuildingsFill size={20} />,
            title: 'Companies',
            href: '/companies',
        },

        {
            id: 2,
            icon: <FaSuitcase size={20} />,
            title: 'Jobs',
            href: '/jobs',
        },

        ...(user
            ? [
                {
                    id: 3,
                    icon: <RiMessage3Fill size={20} />,
                    title: 'Messages',
                    href: '/messages',
                    count: unreadMessagesCount,
                    isCount: true,
                },

                {
                    id: 4,
                    icon: <MdDashboard size={20} />,
                    title: 'Dashboard',
                    href: '/dashboard',
                },
            ]
            : []),
    ];

    return (
        <div className="flex items-center gap-3">
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
                        tooltipbg="white"
                        className={`
                     transition-all duration-200
                     
                     ${isActive
                                ? '!bg-white/10 !text-white'
                                : '!text-neutral-500 hover:!bg-white/10 hover:!text-white'
                            }
                  `}
                    />
                );
            })}
        </div>
    );
};

export default NavIcons;