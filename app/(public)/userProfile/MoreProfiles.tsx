"use client";

import { useQuery } from "@tanstack/react-query";
import { Lock, MessageSquare, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useDispatch } from "react-redux";

import { MoreProfileUser, getSuggestedUsers } from "@/actions/user/more-profile-users";
import { openModal } from "@/store/ModalSlice";

import Batch from "@/components/Batch";
import FollowButton from "@/components/FollowButton";
import Model from "@/components/Model";
import { SkeletonRow } from "@/components/skeletons/MoreProfileSkeleton";
import noAvatar from "@/public/noProfile.webp";
import MessageBox from "../../(protected)/messages/MessageBox";

import { useCurrentUser } from "@/hooks/useCurrentUser";
import { ProfileUser } from "@/types/userProfile";

interface Props {
    profileUser?: ProfileUser;
}

function EmptyState({ text }: { text: string }) {
    return (
        <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                <Users className="h-5 w-5 text-slate-400" strokeWidth={1.75} />
            </div>
            <p className="text-sm text-slate-400">{text}</p>
        </div>
    );
}

interface MoreUserProfileProps {
    moreUser: MoreProfileUser;
}

const MoreUserProfile = ({ moreUser }: MoreUserProfileProps) => {
    const { user } = useCurrentUser();
    const dispatch = useDispatch();
    const isCurrentUser = user?.id === moreUser.id;
    const canMessage = !!user?.isPro;

    return (
        <div className="flex items-start gap-3 border-b border-slate-100 py-3 last:border-b-0">
            <Link href={`/userProfile/${moreUser.id}`} className="flex-shrink-0">
                <div className="relative h-10 w-10 overflow-hidden rounded-full border border-slate-200 bg-slate-100">
                    <Image
                        src={moreUser.image || noAvatar.src}
                        alt={moreUser.displayName}
                        fill
                        sizes="40px"
                        className="object-cover"
                    />
                </div>
            </Link>

            <div className="min-w-0 flex-1 space-y-1">
                <div className="flex flex-wrap items-center gap-1.5">
                    <Link
                        href={`/userProfile/${moreUser.id}`}
                        className="truncate text-sm font-semibold capitalize text-slate-800 transition-colors duration-200 hover:text-indigo-600"
                    >
                        {moreUser.displayName}
                    </Link>
                    {moreUser.role === "ORGANIZATION" ? (
                        <Batch type="ORGANIZATION" />
                    ) : moreUser.isPro ? (
                        <Batch type="premium" />
                    ) : null}
                </div>

                {moreUser.subtitle && <p className="truncate text-xs text-slate-500">{moreUser.subtitle}</p>}

                {!isCurrentUser && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                        <FollowButton targetUserId={moreUser.id} />
                        <button
                            onClick={() => canMessage && dispatch(openModal(`messageModel-${moreUser.id}`))}
                            disabled={!canMessage}
                            title={!canMessage ? "Upgrade to Premium to message" : `Message ${moreUser.displayName}`}
                            className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-[11px] font-semibold transition-all duration-200 ${canMessage
                                ? "border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
                                : "cursor-not-allowed border-slate-200 bg-slate-50 text-slate-400"
                                }`}
                        >
                            {canMessage ? (
                                <MessageSquare className="h-3 w-3" strokeWidth={2} />
                            ) : (
                                <Lock className="h-3 w-3" strokeWidth={2} />
                            )}
                            Message
                        </button>
                    </div>
                )}
            </div>

            <Model
                modalId={`messageModel-${moreUser.id}`}
                title={`Message ${moreUser.displayName}`}
                className="min-w-[300px] lg:w-[800px]"
                bodyContent={
                    <MessageBox
                        receiverId={moreUser.id}
                        chatUser={{
                            id: moreUser.id,
                            username: moreUser.displayName,
                            userImage: moreUser.image,
                        }}
                    />
                }
            >
                <div />
            </Model>
        </div>
    );
};

const MoreProfiles = ({ profileUser }: Props) => {
    const { user, isLoading: isUserLoading } = useCurrentUser();
    const profileUserId = profileUser?.id;
    const isOwnProfile = user?.id === profileUserId;

    const { data: profiles = [], isPending } = useQuery<MoreProfileUser[]>({
        queryKey: ["moreProfiles", profileUserId],
        queryFn: () => getSuggestedUsers(profileUserId as number),
        enabled: typeof profileUserId === "number",
        staleTime: 1000 * 60 * 5,
    });

    return (
        <aside className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-4">
                <Users className="h-4 w-4 text-slate-500" strokeWidth={1.75} />
                <h3 className="text-sm font-bold text-slate-800">{isOwnProfile ? "More Profiles" : "Profile Followers"}</h3>
                {!isPending && profiles.length > 0 && (
                    <span className="ml-auto rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-400">
                        {profiles.length}
                    </span>
                )}
            </div>

            <div className="px-5 py-1">
                {isUserLoading || isPending ? (
                    Array.from({ length: 3 }).map((_, i) => <SkeletonRow key={i} />)
                ) : profiles.length > 0 ? (
                    profiles.map((profile) => <MoreUserProfile key={profile.id} moreUser={profile} />)
                ) : (
                    <EmptyState text={isOwnProfile ? "No similar profiles found." : "No followers yet."} />
                )}
            </div>
        </aside>
    );
};

export default MoreProfiles;