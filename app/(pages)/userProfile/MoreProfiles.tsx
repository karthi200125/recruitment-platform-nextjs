"use client";

import Image from "next/image";
import Link from "next/link";
import { IoMdSend } from "react-icons/io";
import { useDispatch } from "react-redux";
import { useQuery } from "@tanstack/react-query";

import { moreProUsers, MoreProfileUser } from "@/actions/moreProfileUsers";
import { openModal } from "@/app/Redux/ModalSlice";

import Batch from "@/components/Batch";
import Button from "@/components/Button";
import Model from "@/components/Model/Model";
import MessageBox from "../messages/MessageBox";
import FollowButton from "@/components/FollowButton";

import MoreProfileSkeleton from "@/Skeletons/MoreProfileSkeleton";
import noAvatar from "@/public/noProfile.webp";
import { useCurrentUser } from "@/hooks/useCurrentUser";

type UserRole = "CANDIDATE" | "RECRUITER" | "ORGANIZATION";

interface ProfileUserProps {
    userId?: number;
}

const MoreProfiles = ({ userId }: ProfileUserProps) => {
    const { user, isLoading } = useCurrentUser();

    const { data: profiles = [], isPending } = useQuery<MoreProfileUser[]>({
        queryKey: ["moreProfiles", user?.id, userId],
        queryFn: () => {
            if (!user?.id || typeof userId !== "number") return [];
            return moreProUsers(user, userId);
        },
        enabled: !!user?.id && typeof userId === "number",
        staleTime: 1000 * 60 * 5,
    });

    if (isLoading) {
        return <MoreProfileSkeleton />;
    }

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
    moreUser: MoreProfileUser;
}

const MoreUserProfile = ({ moreUser }: MoreUserProfileProps) => {
    const { user } = useCurrentUser();
    const dispatch = useDispatch();

    const isCurrentUser = user?.id === moreUser.id;

    return (
        <div className="flex items-start gap-4 border-b py-4 last:border-b-0">
            {/* Avatar */}
            <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0">
                <Image
                    src={moreUser.userImage || noAvatar}
                    alt={moreUser.username || "User avatar"}
                    fill
                    className="object-cover"
                    sizes="40px"
                />
            </div>

            {/* Info */}
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
                    <p className="text-sm text-neutral-500">
                        {moreUser.profession}
                    </p>
                )}

                {/* Actions */}
                {!isCurrentUser && (
                    <div className="flex items-center gap-2 flex-wrap">
                        <FollowButton
                            targetUserId={moreUser.id}
                            initialIsFollowing={moreUser.isFollowing}
                            className="!h-[32px]"
                        />

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

            {/* Modal */}
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