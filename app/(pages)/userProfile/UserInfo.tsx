"use client";

import CompanyForm from "@/app/Forms/CompanyForm";
import UserBackImage from "@/app/Forms/UserBackImage";
import { UserInfoForm } from "@/app/Forms/UserInfoForm";
import { openModal } from "@/app/Redux/ModalSlice";

import Batch from "@/components/Batch";
import FollowButton from "@/components/FollowButton";
import Model from "@/components/Model/Model";
import UserInfoSkeleton from "@/Skeletons/UserInfoSkeleton";
import MessageBox from "../messages/MessageBox";
import UserProfileImage from "./UserProfileImage";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

import { MapPin, Globe, Pencil, MessageSquare, Lock, Crown, Camera, Users } from "lucide-react";

import { useCurrentUser } from "@/hooks/useCurrentUser";
import noProfile from "../../../public/noProfile.webp";

interface ProfileUserProps {
    profileUser?: any;
    isLoading?: boolean;
    isOrg?: boolean;
    company?: any;
}

const UserInfo = ({ profileUser, isLoading = false, isOrg = false, company }: ProfileUserProps) => {
    const { user } = useCurrentUser();
    const dispatch = useDispatch();
    const router = useRouter();

    const isCurrentUser = user?.id === profileUser?.id;
    const isOrganization = profileUser?.role === "ORGANIZATION";
    const canMessage = !!user?.isPro;

    const displayName = isOrg ? company?.companyName : profileUser?.username;
    const displayBio = isOrg ? company?.companyBio : profileUser?.userBio;
    const website = isOrg ? company?.companyWebsite : profileUser?.website;
    const locationParts = isOrg
        ? [company?.companyCity, company?.companyState, company?.companyCountry]
        : [profileUser?.city, profileUser?.state, profileUser?.country];
    const displayLocation = locationParts.filter(Boolean).join(", ");

    return (
        <div className="relative w-full rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">

            {/* Cover image */}
            <div className="relative w-full h-32 sm:h-44">
                <Image
                    src={profileUser?.profileImage || "https://img.freepik.com/free-photo/abstract-grey-bg.jpg"}
                    alt="Cover"
                    fill
                    className="object-cover"
                    priority
                />
                {/* Cover overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

                {/* Edit cover button */}
                {isCurrentUser && (
                    <Model
                        bodyContent={<UserBackImage />}
                        title="Edit Cover Image"
                        className="w-full md:w-[800px]"
                        triggerCls="absolute top-3 right-3"
                        modalId="UserBackImageModal"
                    >
                        <button
                            aria-label="Edit cover image"
                            onClick={() => dispatch(openModal("UserBackImageModal"))}
                            className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-white/80 backdrop-blur-sm border border-white/60 flex items-center justify-center text-slate-700 hover:bg-white transition-all duration-200 shadow-sm"
                        >
                            <Camera className="w-4 h-4" strokeWidth={1.75} />
                        </button>
                    </Model>
                )}
            </div>

            {/* Avatar + action row */}
            <div className="px-5 pb-0">
                <div className="flex items-end justify-between gap-3 -mt-10 sm:-mt-14 mb-4">

                    {/* Avatar */}
                    <Model
                        bodyContent={<UserProfileImage user={user} isCurrentUser={isCurrentUser} profileUser={profileUser} />}
                        title={isCurrentUser ? "Edit Profile Image" : `${profileUser?.username}'s Photo`}
                        className="w-full md:w-[800px]"
                        triggerCls=""
                        modalId="profileImageModal"
                    >
                        <div className="relative group cursor-pointer flex-shrink-0">
                            <div className={`relative w-20 h-20 sm:w-28 sm:h-28 border-4 border-white shadow-md overflow-hidden bg-slate-100 ${isOrganization ? "rounded-2xl" : "rounded-full"}`}>
                                <Image
                                    src={(isCurrentUser ? user?.profileImage : profileUser?.userImage) || noProfile.src}
                                    alt={displayName ?? "Profile"}
                                    fill
                                    className="object-cover"
                                />
                                {isCurrentUser && (
                                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-inherit">
                                        <Camera className="w-5 h-5 text-white" strokeWidth={1.75} />
                                    </div>
                                )}
                            </div>
                            {profileUser?.isPro && (
                                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-400 border-2 border-white flex items-center justify-center shadow-sm">
                                    <Crown className="w-3 h-3 text-white" strokeWidth={2.5} />
                                </div>
                            )}
                        </div>
                    </Model>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 pb-1">
                        {!isCurrentUser ? (
                            <>
                                <FollowButton
                                    targetUserId={profileUser?.id}
                                />
                                <button
                                    onClick={() => canMessage && dispatch(openModal(`messageModel-${profileUser?.id}`))}
                                    disabled={!canMessage}
                                    title={!canMessage ? "Upgrade to Premium to message" : `Message ${profileUser?.username}`}
                                    className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold border transition-all duration-200 ${canMessage
                                        ? "bg-white border-slate-200 text-slate-700 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700"
                                        : "bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed"
                                        }`}
                                >
                                    {canMessage
                                        ? <MessageSquare className="w-3.5 h-3.5" strokeWidth={2} />
                                        : <Lock className="w-3.5 h-3.5" strokeWidth={2} />
                                    }
                                    Message
                                </button>
                            </>
                        ) : (
                            <Model
                                bodyContent={user?.role === "ORGANIZATION" ? <CompanyForm company={company} /> : <UserInfoForm profileUser={profileUser} />}
                                title="Edit Profile"
                                className="lg:w-[800px]"
                                triggerCls=""
                                modalId="userInfoFormModal"
                            >
                                <button
                                    onClick={() => dispatch(openModal("userInfoFormModal"))}
                                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200"
                                >
                                    <Pencil className="w-3.5 h-3.5" strokeWidth={2} />
                                    Edit Profile
                                </button>
                            </Model>
                        )}
                    </div>
                </div>

                {/* Content */}
                {isLoading ? (
                    <UserInfoSkeleton />
                ) : (
                    <div className="pb-6 space-y-3">

                        {/* Name + badge + profession */}
                        <div>
                            <h1 className="text-xl font-bold text-slate-900 capitalize flex items-center gap-2 flex-wrap leading-tight">
                                {displayName}
                                <Batch type={profileUser?.role} />
                            </h1>
                            {profileUser?.profession && (
                                <p className="text-sm text-slate-500 mt-0.5">{profileUser.profession}</p>
                            )}
                        </div>

                        {/* Bio */}
                        {displayBio && (
                            <p className="text-sm text-slate-600 leading-relaxed max-w-xl">
                                {displayBio}
                            </p>
                        )}

                        {/* Location + website */}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
                            {displayLocation && (
                                <span className="flex items-center gap-1.5 text-sm text-slate-500">
                                    <MapPin className="w-3.5 h-3.5 flex-shrink-0" strokeWidth={2} />
                                    {displayLocation}
                                </span>
                            )}
                            {website && (
                                <a
                                    href={website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-700 hover:underline transition-colors duration-200"
                                >
                                    <Globe className="w-3.5 h-3.5 flex-shrink-0" strokeWidth={2} />
                                    {website.replace(/^https?:\/\//, "")}
                                </a>
                            )}
                        </div>

                        {/* Follower stats */}
                        <div className="flex items-center gap-1 flex-wrap">
                            <Link
                                href={`/network/${profileUser?.id}`}
                                className="group inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 bg-slate-50 border border-slate-200 hover:bg-indigo-50 hover:border-indigo-200 transition-all duration-200"
                            >
                                <Users className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-500 flex-shrink-0" strokeWidth={2} />
                                <span className="text-xs font-bold text-slate-700 group-hover:text-indigo-700">
                                    {profileUser?.followers?.length ?? 0}
                                </span>
                                <span className="text-xs text-slate-500 group-hover:text-indigo-600">Followers</span>
                            </Link>
                            <span className="text-slate-300 px-1">·</span>
                            <Link
                                href={`/network/${profileUser?.id}`}
                                className="group inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 bg-slate-50 border border-slate-200 hover:bg-indigo-50 hover:border-indigo-200 transition-all duration-200"
                            >
                                <span className="text-xs font-bold text-slate-700 group-hover:text-indigo-700">
                                    {profileUser?.following?.length ?? 0}
                                </span>
                                <span className="text-xs text-slate-500 group-hover:text-indigo-600">Following</span>
                            </Link>
                        </div>

                        {/* Premium messaging lock hint */}
                        {!isCurrentUser && !canMessage && (
                            <div className="flex items-center gap-2 rounded-xl bg-amber-50 border border-amber-200 px-3 py-2.5">
                                <Crown className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" strokeWidth={2} />
                                <p className="text-xs text-amber-700">
                                    <span className="font-semibold">Premium</span> members can message directly.{" "}
                                    <Link href="/subscription" className="underline underline-offset-2 hover:text-amber-800 transition-colors">
                                        Upgrade
                                    </Link>
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Message modal */}
            <Model
                bodyContent={<MessageBox receiverId={profileUser?.id} chatUser={profileUser} />}
                title={`Message ${profileUser?.username || "User"}`}
                className="lg:w-[800px]"
                modalId={`messageModel-${profileUser?.id}`}
            >
                <div />
            </Model>
        </div>
    );
};

export default UserInfo;