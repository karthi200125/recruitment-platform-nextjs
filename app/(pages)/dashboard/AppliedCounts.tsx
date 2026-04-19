'use client';

import Link from 'next/link';
import { LiaListSolid } from 'react-icons/lia';
import { LuUsers } from 'react-icons/lu';
import { MdOutlinePendingActions } from 'react-icons/md';
import { FaRegBookmark } from 'react-icons/fa';
import { Prisma } from '@prisma/client';

type JobWithCompany = Prisma.JobGetPayload<{
  include: { company: true };
}>;

type UserWithRelations = Prisma.UserGetPayload<{
  include: {
    postedJobs: true;
  };
}>;

type UserRole = 'CANDIDATE' | 'RECRUITER' | 'ORGANIZATION';

interface AppliedCountsProps {
  appliedJobs: JobWithCompany[];
  user: UserWithRelations;
}

const AppliedCounts = ({ appliedJobs, user }: AppliedCountsProps) => {
  const role = user.role as UserRole;
  
  const roleConfig = {
    CANDIDATE: {
      second: {
        title: 'Applied Jobs',
        subtitle: 'Jobs you have applied to',
        count: appliedJobs.length,
        href: '/dashboard?appliedJobs',
      },
      third: {
        title: 'Actions Taken',
        subtitle: 'Jobs that responded to you',
        count: 0,
        href: '/dashboard?actionTaken',
      },
      showSaved: true,
    },
    RECRUITER: {
      second: {
        title: 'Applied Jobs',
        subtitle: 'Jobs you have applied to',
        count: appliedJobs.length,
        href: '/dashboard?appliedJobs',
      },
      third: {
        title: 'Posted Jobs',
        subtitle: 'Jobs you created',
        count: user.postedJobs?.length ?? 0,
        href: '/dashboard?postedJobs',
      },
      showSaved: true,
    },
    ORGANIZATION: {
      second: {
        title: 'Posted Jobs',
        subtitle: 'Jobs you created',
        count: user.postedJobs?.length ?? 0,
        href: '/dashboard?postedJobs',
      },
      third: {
        title: 'Actions Taken',
        subtitle: 'Candidate responses',
        count: 0,
        href: '/dashboard?actionTaken',
      },
      showSaved: false,
    },
  } as const;

  const config = roleConfig[role];
  
  const cards = [
    {
      id: 'profileViews',
      icon: <LuUsers size={22} />,
      title: 'Profile Views',
      count: user.ProfileViews?.length ?? 0,
      subtitle: 'People who viewed your profile',
      href: '/dashboard?profileViews',
    },
    {
      id: 'second',
      icon: <LiaListSolid size={22} />,
      ...config.second,
    },
    {
      id: 'third',
      icon: <MdOutlinePendingActions size={22} />,
      ...config.third,
    },
    ...(config.showSaved
      ? [
          {
            id: 'saved',
            icon: <FaRegBookmark size={22} />,
            title: 'Saved Jobs',
            count: user.savedJobs?.length ?? 0,
            subtitle: 'Jobs you bookmarked',
            href: '/dashboard?savedJobs',
          },
        ]
      : []),
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((card) => (
        <Link
          key={card.id}
          href={card.href}
          className="group rounded-2xl border bg-white/70 backdrop-blur-sm p-5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between gap-4"
        >
          {/* Top */}
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-neutral-100 group-hover:bg-black group-hover:text-white transition">
              {card.icon}
            </div>
            <h3 className="text-sm font-semibold">{card.title}</h3>
          </div>

          {/* Middle */}
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">{card.count}</h1>
            <span className="h-8 w-[1px] bg-neutral-200" />
            <p className="text-xs text-neutral-500 text-right max-w-[120px]">
              {card.subtitle}
            </p>
          </div>

          {/* Bottom hover effect */}
          <div className="text-xs text-neutral-400 group-hover:text-black transition">
            View details →
          </div>
        </Link>
      ))}
    </div>
  );
};

export default AppliedCounts;