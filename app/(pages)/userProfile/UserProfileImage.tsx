"use client";

import { closeModal } from "@/app/Redux/ModalSlice";
import FileUploader from "@/components/FileUploader";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

interface ProfileUser {
    profileImage?: string | null;
}

interface Props {
    isCurrentUser?: boolean;
    profileUser?: ProfileUser | null;
}

const UserProfileImage = ({
    isCurrentUser = false,
    profileUser,
}: Props) => {
    const dispatch = useDispatch();
    const router = useRouter()
    if (!isCurrentUser) return null;

    return (
        <div className="space-y-5">
            <FileUploader
                type="profile" 
                defaultImage={profileUser?.profileImage || null}
                shape="circle"
                maxSizeMB={3}
                accept={["image/jpeg", "image/png", "image/webp"]}
                autoUpload={false}
                onSuccess={() => {
                    router.refresh()
                    dispatch(closeModal("profileImageModal"));
                }}
            />
        </div>
    );
};

export default UserProfileImage;