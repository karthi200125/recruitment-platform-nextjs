"use client";

import Image from "next/image";
import Link from "next/link";

import FollowButton from "@/components/FollowButton";
import noProfile from "@/public/noProfile.webp";

interface NetworkUserType {
    id: number;
    username: string;
    userImage?: string | null;
    profession?: string | null;
    initialIsFollowing: boolean;
}

interface NetworkUserProps {
    networkUser: NetworkUserType;
}

const NetworkUser = ({ networkUser }: NetworkUserProps) => {
    return (
        <div className="flex items-center justify-between p-3 rounded-xl border bg-white hover:shadow-sm transition">

            {/* LEFT */}
            <div className="flex items-center gap-3 min-w-0">
                <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden shrink-0">
                    <Image
                        src={networkUser.userImage || noProfile}
                        alt={networkUser.username}
                        fill
                        sizes="56px"
                        className="object-cover"
                    />
                </div>

                <div className="min-w-0">
                    <Link
                        href={`/userProfile/${networkUser.id}`}
                        className="font-semibold text-sm md:text-base truncate hover:underline"
                    >
                        {networkUser.username}
                    </Link>

                    {networkUser.profession && (
                        <p className="text-xs md:text-sm text-gray-500 truncate">
                            {networkUser.profession}
                        </p>
                    )}
                </div>
            </div>

            {/* RIGHT → REUSABLE BUTTON */}
            <FollowButton
                targetUserId={networkUser.id}
                initialIsFollowing={networkUser.initialIsFollowing}
            />
        </div>
    );
};

export default NetworkUser;