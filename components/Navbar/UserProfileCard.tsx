'use client';

import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from '@/components/ui/hover-card';

import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { useCallback, useMemo } from 'react';

import {
    User, Briefcase, LayoutDashboard, MessageSquare,
    Plus, ClipboardList, Users, Crown, LogOut,
    ChevronRight, BadgeCheck,
} from 'lucide-react';

import noProfile from '../../public/noProfile.webp';
import { useCurrentUser } from '@/hooks/useCurrentUser';

// ─── Types ────────────────────────────────────────────────────────────────────

interface NavItem {
    id: number;
    title: string;
    icon: React.ElementType;
    href: string;
    visible: boolean;
    danger?: boolean;
}

// ─── Nav items hook ───────────────────────────────────────────────────────────

export const useProfileCardItems = (user: any): NavItem[] => {
    return useMemo(() => {
        if (!user) return [];
        const isOrg = user.role === 'ORGANIZATION';
        const isRec = user.role === 'RECRUITER';
        const isCan = user.role === 'CANDIDATE';

        return [
            { id: 1, title: 'Profile', icon: User, href: `/userProfile/${user.id}`, visible: true },
            { id: 2, title: 'Jobs', icon: Briefcase, href: '/jobs', visible: isRec || isCan },
            { id: 3, title: 'Dashboard', icon: LayoutDashboard, href: '/dashboard', visible: true },
            { id: 4, title: 'Messages', icon: MessageSquare, href: '/messages', visible: true },
            { id: 5, title: 'Post a Job', icon: Plus, href: '/createJob', visible: isRec || isOrg },
            { id: 6, title: 'Job Status', icon: ClipboardList, href: '/dashboard/jobStatus', visible: isRec || isCan },
            { id: 7, title: 'Employees', icon: Users, href: '/dashboard/employees', visible: isOrg },
            { id: 8, title: 'Subscriptions', icon: Crown, href: '/subscriptions', visible: true },
            { id: 9, title: 'Sign Out', icon: LogOut, href: '/signin', visible: true, danger: true },
        ];
    }, [user]);
};

// ─── Component ────────────────────────────────────────────────────────────────

const UserProfileCard = () => {
    const { user, isLoading } = useCurrentUser();
    const router = useRouter();
    const pathname = usePathname();

    const items = useProfileCardItems(user);

    const basePath = useMemo(() => {
        return pathname.startsWith('/userProfile')
            ? pathname.split('/').slice(0, 3).join('/')
            : pathname.split('/').slice(0, 2).join('/');
    }, [pathname]);

    const handleClick = useCallback(async (item: NavItem) => {
        if (item.title === 'Sign Out') {
            await signOut({ callbackUrl: '/signin' });
            return;
        }
        router.push(item.href);
    }, [router]);

    if (isLoading || !user) return null;

    const mainItems = items.filter((i) => i.visible && !i.danger);
    const dangerItems = items.filter((i) => i.visible && i.danger);

    const ROLE_LABEL: Record<string, string> = {
        CANDIDATE: 'Job Seeker',
        RECRUITER: 'Recruiter',
        ORGANIZATION: 'Organization',
    };

    return (
        <HoverCard openDelay={80} closeDelay={120}>
            {/* Trigger — avatar button */}
            <HoverCardTrigger asChild>
                <button
                    onClick={() => router.push(`/userProfile/${user.id}`)}
                    aria-label="Open profile menu"
                    className="relative w-9 h-9 rounded-full ring-2 ring-transparent hover:ring-indigo-400 focus-visible:ring-indigo-400 focus-visible:outline-none transition-all duration-200 flex-shrink-0"
                >
                    <Image
                        src={user.profileImage || noProfile}
                        alt={user.username || 'Profile'}
                        fill
                        className="object-cover rounded-full"
                    />
                    {user.isPro && (
                        <span className="absolute -bottom-px -right-px w-3.5 h-3.5 rounded-full bg-amber-400 border-2 border-white flex items-center justify-center">
                            <Crown className="w-2 h-2 text-white" strokeWidth={3} />
                        </span>
                    )}
                </button>
            </HoverCardTrigger>

            {/* Dropdown panel */}
            <HoverCardContent
                align="end"
                sideOffset={10}
                className="w-64 p-0 rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden"
            >
                {/* User header */}
                <div className="flex items-center gap-3 px-4 py-4 border-b border-slate-100 bg-slate-50/70">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden border border-slate-200 flex-shrink-0">
                        <Image
                            src={user.profileImage || noProfile}
                            alt={user.username || 'Profile'}
                            fill
                            className="object-cover"
                        />
                    </div>

                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-slate-800 truncate capitalize leading-snug">
                            {user.username}
                        </p>
                        <p className="text-xs text-slate-400 truncate">{user.email}</p>

                        {/* Role + Pro badge */}
                        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                            <span className="inline-flex items-center text-[11px] font-semibold text-slate-500 bg-slate-100 rounded-full px-2 py-0.5">
                                {ROLE_LABEL[user.role ?? ''] ?? user.role}
                            </span>
                            {user.isPro && (
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5">
                                    <Crown className="w-2.5 h-2.5" strokeWidth={2.5} />
                                    Pro
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Nav items */}
                <nav className="py-1.5">
                    {mainItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = basePath === item.href;

                        return (
                            <button
                                key={item.id}
                                onClick={() => handleClick(item)}
                                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors duration-150 text-left ${isActive
                                    ? 'bg-indigo-50 text-indigo-700'
                                    : 'text-slate-700 hover:bg-slate-50'
                                    }`}
                            >
                                <Icon
                                    className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-indigo-500' : 'text-slate-400'}`}
                                    strokeWidth={isActive ? 2.5 : 1.75}
                                />
                                <span className={`flex-1 text-sm ${isActive ? 'font-semibold' : 'font-medium'}`}>
                                    {item.title}
                                </span>
                                {isActive && (
                                    <ChevronRight className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" strokeWidth={2.5} />
                                )}
                            </button>
                        );
                    })}
                </nav>

                {/* Sign out */}
                <div className="border-t border-slate-100 py-1.5">
                    {dangerItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <button
                                key={item.id}
                                onClick={() => handleClick(item)}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors duration-150"
                            >
                                <Icon className="w-4 h-4 flex-shrink-0" strokeWidth={1.75} />
                                {item.title}
                            </button>
                        );
                    })}
                </div>
            </HoverCardContent>
        </HoverCard>
    );
};

export default UserProfileCard;