'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import {
    Briefcase, LayoutDashboard, MessageSquare,
    Bell, Bookmark,
} from 'lucide-react';

import { useCurrentUser } from '@/hooks/useCurrentUser';
import { getUnreadMessagesCount } from '@/actions/message/get-unread-messages-count ';

interface NavIconItem {
    id: number;
    label: string;
    href: string;
    icon: React.ElementType;
    mobileVisible: boolean; 
    badgeKey?: 'messages';
}

const NAV_ICONS: NavIconItem[] = [
    { id: 1, label: "Jobs", href: "/jobs", icon: Briefcase, mobileVisible: true },
    { id: 2, label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, mobileVisible: false },
    { id: 3, label: "Messages", href: "/messages", icon: MessageSquare, mobileVisible: false, badgeKey: "messages" },
    { id: 4, label: "Saved", href: "/saved", icon: Bookmark, mobileVisible: false },
    { id: 5, label: "Alerts", href: "/alerts", icon: Bell, mobileVisible: false },
];

export default function NavIcons() {
    const pathname = usePathname();
    const { user } = useCurrentUser();

    const { data: unreadCount = 0 } = useQuery({
        queryKey: ["getUnreadMessagesCount", user?.id],
        queryFn: () => getUnreadMessagesCount(user!.id),
        enabled: !!user?.id,
        refetchInterval: 15000,
    });

    return (
        <div className="flex items-center gap-0.5">
            {NAV_ICONS.map(({ id, label, href, icon: Icon, mobileVisible, badgeKey }) => {
                const isActive = pathname === href || pathname.startsWith(href + "/");
                const badge = badgeKey === "messages" ? unreadCount : 0;

                return (
                    <Link
                        key={id}
                        href={href}
                        aria-label={label}
                        title={label}
                        className={`
                            relative flex flex-col items-center justify-center gap-0.5
                            w-10 h-10 rounded-xl transition-all duration-200
                            ${!mobileVisible ? "hidden sm:flex" : "flex"}
                            ${isActive
                                ? "text-white bg-white/10"
                                : "text-neutral-400 hover:text-white hover:bg-white/[0.07]"
                            }
                        `}
                    >
                        <Icon
                            className="w-5 h-5"
                            strokeWidth={isActive ? 2.5 : 1.75}
                        />

                        {/* Unread badge */}
                        {badge > 0 && (
                            <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 rounded-full bg-indigo-500 flex items-center justify-center text-[10px] font-bold text-white px-1 leading-none">
                                {badge > 99 ? "99+" : badge}
                            </span>
                        )}

                        {/* Active dot */}
                        {isActive && (
                            <span className="absolute bottom-1 w-1 h-1 rounded-full bg-white" />
                        )}
                    </Link>
                );
            })}
        </div>
    );
}