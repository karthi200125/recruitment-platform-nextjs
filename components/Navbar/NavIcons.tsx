'use client'

import { getUnreadMessagesCount } from '@/actions/message/getUnreadMessagesCount ';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useQuery } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';
import { BsFillBuildingsFill } from "react-icons/bs";
import { FaSuitcase } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { RiMessage3Fill } from "react-icons/ri";
import Icon from '../Icon';

const NavIcons = () => {
    const { user, isAuthenticated, isLoading } = useCurrentUser();

    const { data, isPending } = useQuery({
        queryKey: ['getUnreadMessagesCount', user?.id],
        queryFn: () => getUnreadMessagesCount(user?.id!),
        enabled: Boolean(user?.id),
    });
    
    const NavIcons = [
        // {
        //     id: 1,
        //     icon: <FaHome size={20} />,
        //     count: 0,
        //     isCount: false,
        //     title: "Home",
        //     href: user ? "/jobs" : "/"
        // },
        {
            id: 2,
            icon: <RiMessage3Fill size={20} />,
            count: data || 0,
            isCount: true,
            title: "Message",
            href: "/messages"
        },
        {
            id: 3,
            icon: <BsFillBuildingsFill size={20} />,
            count: 0,
            isCount: true,
            title: "Companies",
            href: "/companies"
        },
        {
            id: 4,
            icon: <FaSuitcase size={20} />,
            count: 0,
            isCount: true,
            title: "Jobs",
            href: "/jobs"
        },
        {
            id: 5,
            icon: <MdDashboard size={20} />,
            count: 0,
            isCount: true,
            title: "Dashboard",
            href: "/dashboard"
        },
    ]

    const pathname = usePathname()


    return (
        <div className='flex flex-xrow items-center gap-5'>
            {NavIcons.map((icon) => (
                <Icon
                    key={icon?.id}
                    href={icon?.href}
                    icon={icon?.icon}
                    title={icon?.title}
                    isHover
                    count={icon?.count}
                    tooltipbg='white'
                    className={`${pathname === icon?.href && "!bg-white/10 !text-white"} hover:!bg-white/10 hover:!text-white !text-neutral-600`} />
            ))}
        </div>
    )
}

export default NavIcons