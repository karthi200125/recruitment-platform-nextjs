"use client";

import Image from "next/image";
import Link from "next/link";
import { useTransition, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import { GoPlus } from "react-icons/go";

import { UserFollowAction } from "@/actions/user/UserFollowAction";
import { userFollow } from "@/app/Redux/AuthSlice";
import Button from "@/components/Button";
import noProfile from "@/public/noProfile.webp";


interface NetworkUserType {
    id: number;
    username: string;
    userImage?: string | null;
    profession?: string | null;
}

interface AuthUser {
    id: number;
    followings?: number[];
}

interface RootState {
    user: { user: AuthUser | null };
}

interface NetworkUserProps {
    networkUser: NetworkUserType;
}


const NetworkUser = ({ networkUser }: NetworkUserProps) => {
    const user = useSelector((state: RootState) => state.user.user);
    const dispatch = useDispatch();
    const queryClient = useQueryClient();

    const [isPending, startTransition] = useTransition();


    const isFollowing = useMemo(() => {
        return user?.followings?.includes(networkUser.id) ?? false;
    }, [user?.followings, networkUser.id]);


    const handleFollow = useCallback(() => {
        if (!user?.id || !networkUser.id) return;

        // ✅ Optimistic update
        dispatch(userFollow(networkUser.id));

        startTransition(() => {
            UserFollowAction(user.id, networkUser.id).then((res) => {
                if (!res?.success) {
                    console.error(res?.error);

                    // ❗ rollback if failed
                    dispatch(userFollow(networkUser.id));
                } else {
                    // ✅ refresh network data
                    queryClient.invalidateQueries({
                        queryKey: ["networkUsers"],
                    });
                }
            });
        });
    }, [user?.id, networkUser.id, dispatch, queryClient]);


    return (
        <div className="flex items-center justify-between p-3 rounded-xl border bg-white hover:shadow-sm transition">

            {/* LEFT: Profile */}
            <div className="flex items-center gap-3 min-w-0">

                {/* Avatar */}
                <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden shrink-0">
                    <Image
                        src={networkUser.userImage || noProfile}
                        alt={networkUser.username}
                        fill
                        sizes="56px"
                        className="object-cover"
                    />
                </div>

                {/* Info */}
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

            {/* RIGHT: Follow Button */}
            <Button
                variant={isFollowing ? "default" : "border"}
                isLoading={isPending}
                onClick={handleFollow}
                className={`text-xs md:text-sm px-3 py-1.5 rounded-md ${isFollowing ? "bg-[var(--voilet)] text-white" : ""}`}
            >
                {isFollowing ? "Following" : "Follow"}
            </Button>
        </div>
    );
};

export default NetworkUser;