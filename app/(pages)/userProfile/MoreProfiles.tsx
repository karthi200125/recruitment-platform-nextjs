"use client";

import Image from "next/image";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { MessageSquare, Lock, Users, Crown } from "lucide-react";

import { moreProUsers, MoreProfileUser } from "@/actions/moreProfileUsers";
import { openModal } from "@/app/Redux/ModalSlice";

import Batch from "@/components/Batch";
import Model from "@/components/Model/Model";
import MessageBox from "../messages/MessageBox";
import FollowButton from "@/components/FollowButton";
import MoreProfileSkeleton from "@/Skeletons/MoreProfileSkeleton";
import noAvatar from "@/public/noProfile.webp";

import { useCurrentUser } from "@/hooks/useCurrentUser";
import { ProfileUser } from "@/types/userProfile";

interface Props {
    profileUser?: ProfileUser;
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function SkeletonRow() {
    return (
        <div className="flex items-start gap-3 py-3 animate-pulse">
            <div className="w-10 h-10 rounded-full bg-slate-200 flex-shrink-0" />
            <div className="flex-1 space-y-2 pt-0.5">
                <div className="h-3.5 w-2/3 rounded-lg bg-slate-200" />
                <div className="h-3 w-1/2 rounded-lg bg-slate-100" />
                <div className="flex gap-2 mt-1">
                    <div className="h-7 w-20 rounded-xl bg-slate-100" />
                    <div className="h-7 w-20 rounded-xl bg-slate-100" />
                </div>
            </div>
        </div>
    );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState({ text }: { text: string }) {
    return (
        <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                <Users className="w-5 h-5 text-slate-400" strokeWidth={1.75} />
            </div>
            <p className="text-sm text-slate-400">{text}</p>
        </div>
    );
}

// ─── Single user row ──────────────────────────────────────────────────────────

interface MoreUserProfileProps {
    moreUser: MoreProfileUser;
}

const MoreUserProfile = ({ moreUser }: MoreUserProfileProps) => {
    const { user } = useCurrentUser();
    const dispatch = useDispatch();
    const isCurrentUser = user?.id === moreUser.id;
    const canMessage = !!user?.isPro;

    return (
        <div className="flex items-start gap-3 py-3 border-b border-slate-100 last:border-b-0">

            {/* Avatar */}
            <Link href={`/userProfile/${moreUser.id}`} className="flex-shrink-0">
                <div className="relative">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden border border-slate-200 bg-slate-100">
                        <Image
                            src={moreUser.userImage || noAvatar.src}
                            alt={moreUser.username || "User"}
                            fill
                            sizes="40px"
                            className="object-cover"
                        />
                    </div>
                    {moreUser.isPro && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-amber-400 border border-white flex items-center justify-center">
                            <Crown className="w-2 h-2 text-white" strokeWidth={3} />
                        </div>
                    )}
                </div>
            </Link>

            {/* Info */}
            <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                    <Link
                        href={`/userProfile/${moreUser.id}`}
                        className="text-sm font-semibold text-slate-800 capitalize hover:text-indigo-600 transition-colors duration-200 truncate"
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
                    <p className="text-xs text-slate-500 truncate">{moreUser.profession}</p>
                )}

                {!isCurrentUser && (
                    <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                        <FollowButton
                            targetUserId={moreUser.id}                                                        
                        />
                        <button
                            onClick={() => canMessage && dispatch(openModal(`messageModel-${moreUser.id}`))}
                            disabled={!canMessage}
                            title={!canMessage ? "Upgrade to Premium to message" : `Message ${moreUser.username}`}
                            className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold border transition-all duration-200 ${
                                canMessage
                                    ? "bg-white border-slate-200 text-slate-600 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700"
                                    : "bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed"
                            }`}
                        >
                            {canMessage
                                ? <MessageSquare className="w-3 h-3" strokeWidth={2} />
                                : <Lock className="w-3 h-3" strokeWidth={2} />
                            }
                            Message
                        </button>
                    </div>
                )}
            </div>

            {/* Message modal */}
            <Model
                modalId={`messageModel-${moreUser.id}`}
                title={`Message ${moreUser.username || "User"}`}
                className="min-w-[300px] lg:w-[800px]"
                bodyContent={<MessageBox receiverId={moreUser.id} chatUser={moreUser} />}
            >
                <div />
            </Model>
        </div>
    );
};

// ─── Main component ───────────────────────────────────────────────────────────

const MoreProfiles = ({ profileUser }: Props) => {
    const { user, isLoading: isUserLoading } = useCurrentUser();
    const profileUserId = profileUser?.id;
    const role = profileUser?.role;
    const isOwnProfile = user?.id === profileUserId;

    const { data: profiles = [], isPending } = useQuery<MoreProfileUser[]>({
        queryKey: ["moreProfiles", user?.id, profileUserId, role],
        queryFn: async () => {
            if (!profileUserId || typeof profileUserId !== "number" || !role) return [];
            return moreProUsers(profileUserId, profileUser?.followers, role);
        },
        enabled: !!user?.id && typeof profileUserId === "number" && !!role,
        staleTime: 1000 * 60 * 5,
    });

    return (
        <aside className="w-full rounded-2xl border border-slate-200 bg-white overflow-hidden">

            {/* Header */}
            <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-100">
                <Users className="w-4 h-4 text-slate-500" strokeWidth={1.75} />
                <h3 className="text-sm font-bold text-slate-800">
                    {isOwnProfile ? "More Profiles" : "Profile Followers"}
                </h3>
                {!isPending && profiles.length > 0 && (
                    <span className="ml-auto text-xs font-semibold text-slate-400 bg-slate-100 rounded-full px-2 py-0.5">
                        {profiles.length}
                    </span>
                )}
            </div>

            <div className="px-5 py-1">
                {isUserLoading || isPending ? (
                    Array.from({ length: 3 }).map((_, i) => <SkeletonRow key={i} />)
                ) : profiles.length > 0 ? (
                    profiles.map((profile) => (
                        <MoreUserProfile key={profile.id} moreUser={profile} />
                    ))
                ) : (
                    <EmptyState text={isOwnProfile ? "No similar profiles found." : "No followers yet."} />
                )}
            </div>
        </aside>
    );
};

export default MoreProfiles;