
"use client";

import Image from "next/image";
import Link from "next/link";
import { useTransition } from "react";
import { GoPlus } from "react-icons/go";
import { IoMdSend } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { moreProUsers } from "@/actions/moreProfileUsers";
import { UserFollowAction } from "@/actions/user/UserFollowAction";
import { userFollow } from "@/app/Redux/AuthSlice";
import { openModal } from "@/app/Redux/ModalSlice";

import Batch from "@/components/Batch";
import Button from "@/components/Button";
import Model from "@/components/Model/Model";
import MessageBox from "../messages/MessageBox";

import { useCustomToast } from "@/lib/CustomToast";
import MoreProfileSkeleton from "@/Skeletons/MoreProfileSkeleton";

import noAvatar from "@/public/noProfile.webp";

interface User {
    id: number;
    userImage?: string | null;
    username?: string;
    isPro?: boolean;
    role?: string;
    profession?: string;
}

interface RootState {
    user: {
        user: {
            id: number;
            isPro?: boolean;
            followings?: number[];
        } | null;
    };
}

interface ProfileUserProps {
    userId?: number;
}

const MoreProfiles = ({ userId }: ProfileUserProps) => {
    const user = useSelector((state: RootState) => state.user.user);

    const {
        data: profiles = [],
        isPending,
    } = useQuery<User[]>({
        queryKey: ["moreProfiles", user?.id, userId],
        queryFn: () => moreProUsers(user, userId!),
        enabled: !!user?.id && typeof userId === "number",
        staleTime: 1000 * 60 * 5,
    });

    return (
        <aside className="w-full min-h-[200px] rounded-2xl border p-5 space-y-4 overflow-hidden">
            <h3 className="font-bold text-base">
                {user?.id === userId ? "More Profiles" : "Profile Followers"}
            </h3>

            {isPending ? (
                <MoreProfileSkeleton />
            ) : profiles.length > 0 ? (
                profiles.map((profile) => (
                    <MoreUserProfile key={profile.id} moreUser={profile} />
                ))
            ) : (
                <p className="text-sm text-neutral-400">No profiles found.</p>
            )}
        </aside>
    );
};

export default MoreProfiles;

interface MoreUserProfileProps {
    moreUser: User;
}

const MoreUserProfile = ({ moreUser }: MoreUserProfileProps) => {
    const user = useSelector((state: RootState) => state.user.user);

    const dispatch = useDispatch();
    const queryClient = useQueryClient();

    const { showSuccessToast, showErrorToast } = useCustomToast();

    const [isPending, startTransition] = useTransition();

    const isCurrentUser = user?.id === moreUser.id;
    const isFollowing = user?.followings?.includes(moreUser.id);

    const handleFollow = () => {
        if (!user?.id) return;

        startTransition(async () => {
            try {
                const result = await UserFollowAction(user.id, moreUser.id);

                if (result?.success) {
                    showSuccessToast(result.success);

                    dispatch(userFollow(moreUser.id));

                    queryClient.invalidateQueries({
                        queryKey: ["getUser", user.id],
                    });
                } else if (result?.error) {
                    showErrorToast(result.error);
                }
            } catch {
                showErrorToast("Something went wrong.");
            }
        });
    };

    return (
        <div className="flex items-start gap-4 border-b py-4 last:border-b-0">
            <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0">
                <Image
                    src={moreUser.userImage || noAvatar}
                    alt={moreUser.username || "User avatar"}
                    fill
                    className="object-cover"
                    sizes="40px"
                />
            </div>

            <div className="flex-1 space-y-2 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                    <Link
                        href={`/userProfile/${moreUser.id}`}
                        className="font-semibold capitalize hover:underline truncate"
                    >
                        {moreUser.username}
                    </Link>

                    {moreUser.role === "ORGANIZATION" ? (
                        <Batch type="ORGANIZATION" />
                    ) : moreUser.isPro ? (
                        <Batch type="premium" />
                    ) : null}
                </div>

                {moreUser.profession && (
                    <p className="text-sm text-neutral-500">{moreUser.profession}</p>
                )}

                {!isCurrentUser && (
                    <div className="flex items-center gap-2 flex-wrap">
                        <Button
                            variant="border"
                            isLoading={isPending}
                            onClick={handleFollow}
                            icon={!isFollowing ? <GoPlus size={18} /> : undefined}
                            className={`!h-[32px] ${isFollowing ? "!bg-[var(--voilet)] text-white" : ""
                                }`}
                        >
                            {isFollowing ? "Unfollow" : "Follow"}
                        </Button>

                        <Button
                            variant="border"
                            disabled={!user?.isPro}
                            onClick={() =>
                                dispatch(openModal(`messageModel-${moreUser.id}`))
                            }
                            icon={<IoMdSend size={18} />}
                            className="!h-[32px]"
                        >
                            Message
                        </Button>
                    </div>
                )}
            </div>

            <Model
                modalId={`messageModel-${moreUser.id}`}
                title={`Message ${moreUser.username || "User"}`}
                className="min-w-[300px] lg:w-[800px]"
                bodyContent={
                    <MessageBox receiverId={moreUser.id} chatUser={moreUser} />
                }
            >
                <div />
            </Model>
        </div>
    );
};

