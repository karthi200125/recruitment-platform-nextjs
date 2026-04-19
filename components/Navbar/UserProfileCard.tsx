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

import noProfile from '../../public/noProfile.webp';
import { useCurrentUser } from '@/hooks/useCurrentUser';

import { IoPersonOutline } from 'react-icons/io5';
import { FaSuitcase, FaUsers } from 'react-icons/fa';
import { MdDashboard } from 'react-icons/md';
import { PiSignOutBold } from 'react-icons/pi';
import { GoPlus } from 'react-icons/go';
import { GrStatusCriticalSmall } from 'react-icons/gr';
import { RiMessage3Fill } from 'react-icons/ri';

export const useProfileCardItems = (user: any) => {
    return useMemo(() => {
        if (!user) return [];

        const isOrg = user.role === 'ORGANIZATION';
        const isRec = user.role === 'RECRUITER';
        const isCan = user.role === 'CANDIDATE';

        return [
            {
                id: 1,
                title: 'Profile',
                icon: <IoPersonOutline size={20} />,
                href: `/userProfile/${user.id}`,
                visible: true,
            },
            {
                id: 2,
                title: 'Jobs',
                icon: <FaSuitcase size={20} />,
                href: '/jobs',
                visible: isRec || isCan,
            },
            {
                id: 3,
                title: 'Dashboard',
                icon: <MdDashboard size={20} />,
                href: '/dashboard',
                visible: true,
            },
            {
                id: 4,
                title: 'Messages',
                icon: <RiMessage3Fill size={20} />,
                href: '/messages',
                visible: true,
            },
            {
                id: 5,
                title: 'Create Job',
                icon: <GoPlus size={20} />,
                href: '/createJob',
                visible: isRec || isOrg,
            },
            {
                id: 6,
                title: 'Job Status',
                icon: <GrStatusCriticalSmall size={20} />,
                href: '/dashboard/jobStatus',
                visible: isRec || isCan,
            },
            {
                id: 7,
                title: 'Employees',
                icon: <FaUsers size={20} />,
                href: '/dashboard/employees',
                visible: isOrg,
            },
            {
                id: 8,
                title: 'Subscriptions',
                icon: <FaUsers size={20} />,
                href: '/dashboard/subscriptions',
                visible: isRec || isCan || isOrg,
            },
            {
                id: 9,
                title: 'Sign Out',
                icon: <PiSignOutBold size={20} />,
                href: '/signin',
                visible: true,
            },
        ];
    }, [user]);
};

const UserProfileCard = () => {
    const { user, isLoading } = useCurrentUser();
    const router = useRouter();
    const pathname = usePathname();

    const profileCardItems = useProfileCardItems(user);

    const basePath = useMemo(() => {
        return pathname.startsWith('/userProfile')
            ? pathname.split('/').slice(0, 3).join('/')
            : pathname.split('/').slice(0, 2).join('/');
    }, [pathname]);

    const handleClick = useCallback(
        async (item: (typeof profileCardItems)[number]) => {
            if (item.title === 'Sign Out') {
                await signOut({
                    callbackUrl: '/signin',
                });
                return;
            }

            router.push(item.href);
        },
        [router, profileCardItems]
    );

    if (isLoading || !user) return null;

    return (
        <HoverCard>
            <HoverCardTrigger asChild>
                <button onClick={() => router.push(`/userProfile/${user.id}`)}>
                    <div className="w-[35px] h-[35px] relative overflow-hidden rounded-full">
                        <Image
                            src={user.profileImage || noProfile}
                            alt="User profile"
                            fill
                            className="object-cover rounded-full"
                        />
                    </div>
                </button>
            </HoverCardTrigger>

            <HoverCardContent className="space-y-3 min-w-[250px]">
                <div className="flex gap-4 border-b pb-3">
                    <Image
                        src={user.profileImage || noProfile}
                        alt="User profile"
                        width={60}
                        height={60}
                        className="rounded-full object-cover"
                    />

                    <div className="min-w-0">
                        <h4 className="font-bold line-clamp-1">{user.username}</h4>
                        <p className="text-xs text-neutral-400 line-clamp-1">
                            {user.email}
                        </p>
                    </div>
                </div>

                <div className="space-y-1">
                    {profileCardItems
                        .filter((item) => item.visible)
                        .map((item) => (
                            <button
                                key={item.id}
                                onClick={() => handleClick(item)}
                                className={`w-full flex items-center gap-4 p-3 rounded-md text-left transition hover:bg-neutral-100 ${basePath === item.href ? 'bg-neutral-100' : ''
                                    }`}
                            >
                                {item.icon}
                                <span>{item.title}</span>
                            </button>
                        ))}
                </div>
            </HoverCardContent>
        </HoverCard>
    );
};

export default UserProfileCard;