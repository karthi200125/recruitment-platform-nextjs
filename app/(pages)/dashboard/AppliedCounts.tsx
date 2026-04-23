"use client";

import Link from "next/link";
import { LiaListSolid } from "react-icons/lia";
import { LuUsers } from "react-icons/lu";
import { MdOutlinePendingActions } from "react-icons/md";
import { FaRegBookmark } from "react-icons/fa";
import { Prisma } from "@prisma/client";

type JobWithCompany = Prisma.JobGetPayload<{
  include: { company: true };
}>;

type UserWithRelations = Prisma.UserGetPayload<{
  include: {
    postedJobs: true;
    savedJobs: true;
  };
}>;

type UserRole = "CANDIDATE" | "RECRUITER" | "ORGANIZATION";

interface AppliedCountsProps {
  appliedJobs: JobWithCompany[];
  user: UserWithRelations;
}

const AppliedCounts = ({ appliedJobs, user }: AppliedCountsProps) => {
  const role = user.role as UserRole;

  const cards = [
    {
      id: "profileViews",
      icon: <LuUsers size={22} />,
      title: "Profile Views",
      count: user.ProfileViews?.length ?? 0,
      subtitle: "People viewed your profile",
      href: "/dashboard?tab=profileViews",
    },

    ...(role !== "ORGANIZATION"
      ? [
        {
          id: "applied",
          icon: <LiaListSolid size={22} />,
          title: "Applied Jobs",
          count: appliedJobs.length,
          subtitle: "Jobs you applied",
          href: "/dashboard?tab=applied",
        },
      ]
      : []),

    ...(role !== "CANDIDATE"
      ? [
        {
          id: "posted",
          icon: <MdOutlinePendingActions size={22} />,
          title: "Posted Jobs",
          count: user.postedJobs?.length ?? 0,
          subtitle: "Jobs you created",
          href: "/dashboard?tab=posted",
        },
      ]
      : []),

    ...(role !== "ORGANIZATION"
      ? [
        {
          id: "saved",
          icon: <FaRegBookmark size={22} />,
          title: "Saved Jobs",
          count: user.savedJobs?.length ?? 0,
          subtitle: "Jobs you bookmarked",
          href: "/dashboard?tab=saved",
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
          className="group rounded-2xl border bg-white/70 backdrop-blur-sm p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between gap-4"
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
            <p className="text-xs text-neutral-500 text-right max-w-[120px]">
              {card.subtitle}
            </p>
          </div>

          {/* Bottom */}
          <div className="text-xs text-neutral-400 group-hover:text-black">
            View details →
          </div>
        </Link>
      ))}
    </div>
  );
};

export default AppliedCounts;