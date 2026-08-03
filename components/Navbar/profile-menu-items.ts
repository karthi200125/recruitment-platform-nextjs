import { SessionUser } from '@/types';
import type { LucideIcon } from 'lucide-react';
import {
    Briefcase,
    ClipboardList,
    Crown,
    LayoutDashboard,
    LogOut,
    MessageSquare,
    Plus,
    Settings,
    User,
    Users,
} from 'lucide-react';

export interface ProfileMenuItem {
    id: number;
    title: string;
    icon: LucideIcon;
    href: string;
    visible: boolean;
    danger?: boolean;
    action?: 'signOut';
}

export const getProfileMenuItems = (user: SessionUser | null): ProfileMenuItem[] => {
    if (!user) {
        return [];
    }

    const isOrganization = user.role === 'ORGANIZATION';
    const isRecruiter = user.role === 'RECRUITER';
    const isCandidate = user.role === 'CANDIDATE';

    return [
        {
            id: 1,
            title: 'Profile',
            icon: User,
            href: `/userProfile/${user.id}`,
            visible: true,
        },
        {
            id: 2,
            title: 'Jobs',
            icon: Briefcase,
            href: '/jobs',
            visible: isRecruiter || isCandidate,
        },
        {
            id: 3,
            title: 'Dashboard',
            icon: LayoutDashboard,
            href: '/dashboard',
            visible: true,
        },
        {
            id: 4,
            title: 'Messages',
            icon: MessageSquare,
            href: '/messages',
            visible: true,
        },
        {
            id: 5,
            title: 'Post a Job',
            icon: Plus,
            href: '/createJob',
            visible: isRecruiter || isOrganization,
        },
        {
            id: 6,
            title: 'Job Status',
            icon: ClipboardList,
            href: '/dashboard/jobStatus',
            visible: isRecruiter || isCandidate,
        },
        {
            id: 7,
            title: 'Employees',
            icon: Users,
            href: '/dashboard/employees',
            visible: isOrganization,
        },
        {
            id: 8,
            title: 'Subscriptions',
            icon: Crown,
            href: '/subscriptions',
            visible: true,
        },
        {
            id: 9,
            title: 'Settings',
            icon: Settings,
            href: '/setting',
            visible: true,
        },
        {
            id: 10,
            title: 'Sign Out',
            icon: LogOut,
            href: '/signin',
            visible: true,
            danger: true,
            action: 'signOut',
        },
    ];
};