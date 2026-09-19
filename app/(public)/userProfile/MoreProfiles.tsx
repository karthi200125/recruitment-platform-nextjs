"use client";

import { Lock, MessageSquare, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useDispatch } from "react-redux";

import type { MoreProfileUser } from "@/actions/user/more-profile-users";
import { openModal } from "@/store/ModalSlice";

import Batch from "@/components/Batch";
import FollowButton from "@/components/FollowButton";
import Model from "@/components/Model";
import noAvatar from "@/public/noProfile.webp";

import MessageBox from "../../(protected)/messages/MessageBox";

interface CurrentUser {
    id: number;
    isPro: boolean;
}

interface Props {
    profileUserId: number;
    suggestedUsers: MoreProfileUser[];
    currentUser?: CurrentUser | null;
}

function EmptyState({
    text,
}: {
    text: string;
}) {
    return (
        <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                <Users
                    className="h-5 w-5 text-slate-400"
                    strokeWidth={1.75}
                />
            </div>

            <p className="text-sm text-slate-400">
                {text}
            </p>
        </div>
    );
}

interface MoreUserProfileProps {
    moreUser: MoreProfileUser;
    currentUser?: CurrentUser | null;
}

const MoreUserProfile = ({
    moreUser,
    currentUser,
}: MoreUserProfileProps) => {
    const dispatch = useDispatch();

    const isCurrentUser =
        currentUser?.id === moreUser.id;

    const canMessage =
        Boolean(currentUser?.isPro);

    return (
        <div className="flex items-start gap-3 border-b border-slate-100 py-3 last:border-b-0">

            {/* Profile image */}
            <Link
                href={`/userProfile/${moreUser.id}`}
                className="flex-shrink-0"
            >
                <div className="relative h-10 w-10 overflow-hidden rounded-full border border-slate-200 bg-slate-100">
                    <Image
                        src={
                            moreUser.image ||
                            noAvatar.src
                        }
                        alt={moreUser.displayName}
                        fill
                        sizes="40px"
                        className="object-cover"
                    />
                </div>
            </Link>

            {/* Profile information */}
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

                {moreUser.subtitle && (
                    <p className="truncate text-xs text-slate-500">
                        {moreUser.subtitle}
                    </p>
                )}

                {!isCurrentUser && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-0.5">

                        <FollowButton
                            targetUserId={moreUser.id}
                        />

                        <button
                            type="button"
                            onClick={() => {
                                if (!canMessage) {
                                    return;
                                }

                                dispatch(
                                    openModal(
                                        `messageModel-${moreUser.id}`
                                    )
                                );
                            }}
                            disabled={!canMessage}
                            title={
                                !canMessage
                                    ? "Upgrade to Premium to message"
                                    : `Message ${moreUser.displayName}`
                            }
                            className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-[11px] font-semibold transition-all duration-200 ${canMessage
                                    ? "border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
                                    : "cursor-not-allowed border-slate-200 bg-slate-50 text-slate-400"
                                }`}
                        >
                            {canMessage ? (
                                <MessageSquare
                                    className="h-3 w-3"
                                    strokeWidth={2}
                                />
                            ) : (
                                <Lock
                                    className="h-3 w-3"
                                    strokeWidth={2}
                                />
                            )}

                            Message
                        </button>

                    </div>
                )}
            </div>

            {/* Message modal */}
            <Model
                modalId={`messageModel-${moreUser.id}`}
                title={`Message ${moreUser.displayName}`}
                className="min-w-[300px] lg:w-[800px]"
                bodyContent={
                    <MessageBox
                        receiverId={moreUser.id}
                        chatUser={{
                            id: moreUser.id,
                            username:
                                moreUser.displayName,
                            profileImage:
                                moreUser.image,
                        }}
                    />
                }
            >
                <div />
            </Model>

        </div>
    );
};

const MoreProfiles = ({
    profileUserId,
    suggestedUsers,
    currentUser,
}: Props) => {
    const isOwnProfile =
        currentUser?.id === profileUserId;

    return (
        <aside className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white">

            {/* Header */}
            <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-4">

                <Users
                    className="h-4 w-4 text-slate-500"
                    strokeWidth={1.75}
                />

                <h3 className="text-sm font-bold text-slate-800">
                    {isOwnProfile
                        ? "More Profiles"
                        : "Profile Followers"}
                </h3>

                {suggestedUsers.length > 0 && (
                    <span className="ml-auto rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-400">
                        {suggestedUsers.length}
                    </span>
                )}

            </div>

            {/* Profiles */}
            <div className="px-5 py-1">

                {suggestedUsers.length > 0 ? (
                    suggestedUsers.map((profile) => (
                        <MoreUserProfile
                            key={profile.id}
                            moreUser={profile}
                            currentUser={currentUser}
                        />
                    ))
                ) : (
                    <EmptyState
                        text={
                            isOwnProfile
                                ? "No similar profiles found."
                                : "No followers yet."
                        }
                    />
                )}

            </div>
        </aside>
    );
};

export default MoreProfiles;