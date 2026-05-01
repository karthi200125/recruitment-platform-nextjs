"use client";

import CompanyForm from "@/app/Forms/CompanyForm";
import UserBackImage from "@/app/Forms/UserBackImage";
import { UserInfoForm } from "@/app/Forms/UserInfoForm";
import { openModal } from "@/app/Redux/ModalSlice";

import Batch from "@/components/Batch";
import Button from "@/components/Button";
import FollowButton from "@/components/FollowButton";
import Icon from "@/components/Icon";
import Model from "@/components/Model/Model";

import UserInfoSkeleton from "@/Skeletons/UserInfoSkeleton";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

import { IoMdSend } from "react-icons/io";
import { LuPencil } from "react-icons/lu";
import { VscLinkExternal } from "react-icons/vsc";

import { useCurrentUser } from "@/hooks/useCurrentUser";
import noProfile from "../../../public/noProfile.webp";
import MessageBox from "../messages/MessageBox";
import UserProfileImage from "./UserProfileImage";

interface ProfileUserProps {
    profileUser?: any;
    isLoading?: boolean;
    isOrg?: boolean;
    company?: any;
}

const UserInfo = ({
    profileUser,
    isLoading = false,
    isOrg = false,
    company,
}: ProfileUserProps) => {
    const { user } = useCurrentUser();
    const dispatch = useDispatch();
    const router = useRouter();

    const isCurrentUser = user?.id === profileUser?.id;

    // ✅ Profile Display Data
    const displayName = isOrg
        ? company?.companyName
        : profileUser?.username;

    const displayBio = isOrg
        ? company?.companyBio
        : profileUser?.userBio;

    const displayLocation = isOrg
        ? `${company?.companyCity}, ${company?.companyState}, ${company?.companyCountry}`
        : `${profileUser?.city}, ${profileUser?.state}, ${profileUser?.country}`;

    const website = isOrg
        ? company?.companyWebsite
        : profileUser?.website;

    return (
        <div className="relative w-full min-h-[200px] overflow-hidden rounded-[20px] border">

            {/* 🔥 COVER IMAGE */}
            <div className="absolute top-0 left-0 w-full h-[120px] md:h-[200px]">
                <Image
                    src={
                        profileUser?.profileImage ||
                        "https://img.freepik.com/free-photo/abstract-grey-bg.jpg"
                    }
                    alt="Profile Background"
                    fill
                    className="object-cover"
                />

                {/* PROFILE IMAGE */}
                <Model
                    bodyContent={
                        <UserProfileImage
                            user={user}
                            isCurrentUser={isCurrentUser}
                            profileUser={profileUser}
                        />
                    }
                    title={
                        isCurrentUser
                            ? "Edit Images"
                            : `${profileUser?.username} Profile Image`
                    }
                    className="w-full md:w-[800px]"
                    triggerCls="absolute bottom-[-30px] md:bottom-[-40px] left-5"
                    modalId="profileImageModal"

                >
                    <div
                        className={`relative w-[120px] md:w-[150px] h-[120px] md:h-[150px] border-4 border-white overflow-hidden ${profileUser?.role !== "ORGANIZATION"
                            ? "rounded-full"
                            : ""
                            }`}
                    >
                        <Image
                            src={
                                (isCurrentUser
                                    ? user?.profileImage
                                    : profileUser?.userImage) || noProfile.src

                            }
                            alt="Profile"
                            fill
                            className="object-cover"
                        />
                    </div>
                </Model>

                {/* EDIT BACK IMAGE */}
                {isCurrentUser && (
                    <Model
                        bodyContent={<UserBackImage />}
                        title="Edit Images"
                        className="w-full md:w-[800px]"
                        triggerCls="absolute top-3 right-3"
                        modalId="UserBackImageModal"
                    >
                        <Icon
                            icon={<LuPencil size={20} />}
                            className="bg-white hover:opacity-50"
                            isHover
                            title="Edit UserBackImage"
                            onClick={() =>
                                dispatch(openModal("UserBackImageModal"))
                            }
                        />
                    </Model>
                )}
            </div>

            {/* 🔥 CONTENT */}
            {isLoading ? (
                <UserInfoSkeleton />
            ) : (
                <div className="relative mt-[130px] md:mt-[250px] w-full p-5 space-y-3">

                    {/* USER DETAILS */}
                    <h2 className="font-bold flex items-center gap-3">
                        {displayName}
                        <Batch type={profileUser?.role} />
                    </h2>

                    <p className="text-sm text-[var(--lighttext)]">
                        {displayBio}
                    </p>

                    <p className="capitalize">{displayLocation}</p>

                    {website && (
                        <a
                            href={website}
                            target="_blank"
                            className="flex items-center gap-2 text-[var(--voilet)] hover:underline"
                        >
                            Website <VscLinkExternal size={14} />
                        </a>
                    )}

                    {/* FOLLOW STATS */}
                    <div className="flex gap-5 py-3 font-bold">
                        <span
                            className="cursor-pointer"
                            onClick={() =>
                                router.push(`/network/${profileUser?.id}`)
                            }
                        >
                            {profileUser?.followers?.length || 0} Followers
                        </span>

                        <span
                            className="cursor-pointer"
                            onClick={() =>
                                router.push(`/network/${profileUser?.id}`)
                            }
                        >
                            {profileUser?.following?.length || 0} Following
                        </span>
                    </div>

                    {/* 🔥 ACTIONS */}
                    {!isCurrentUser ? (
                        <div className="flex gap-4">
                            {/* ✅ NEW FOLLOW BUTTON */}
                            <FollowButton targetUserId={profileUser?.id} />

                            <Button
                                onClick={() =>
                                    dispatch(
                                        openModal(`messageModel-${profileUser?.id}`)
                                    )
                                }
                                disabled={!user?.isPro}
                                variant="border"
                                icon={<IoMdSend size={18} />}
                            >
                                Message
                            </Button>
                        </div>
                    ) : (
                        <Model
                            bodyContent={
                                user?.role === "ORGANIZATION" ? (
                                    <CompanyForm company={company} />
                                ) : (
                                    <UserInfoForm profileUser={profileUser} />
                                )
                            }
                            title="Edit Profile"
                            className="lg:w-[800px]"
                            triggerCls="absolute top-3 right-3"
                            modalId="userInfoFormModal"
                        >
                            <Icon
                                icon={<LuPencil size={20} />}
                                isHover
                                title="Edit UserBackImage"
                                onClick={() =>
                                    dispatch(openModal("userInfoFormModal"))
                                }
                            />
                        </Model>
                    )}

                    {/* MESSAGE MODAL */}
                    <Model
                        bodyContent={
                            <MessageBox
                                receiverId={profileUser?.id}
                                chatUser={profileUser}
                            />
                        }
                        title={`Message ${profileUser?.username || "User"}`}
                        className="lg:w-[800px]"
                        modalId={`messageModel-${profileUser?.id}`}
                    >
                        <div />
                    </Model>
                </div>
            )}
        </div>
    );
};

export default UserInfo;