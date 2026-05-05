"use client";

import { closeModal } from "@/app/Redux/ModalSlice";
import FileUploader from "@/components/FileUploader";
import { ProfileUser } from "@/types/userProfile";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

const UserBannerImage = ({ userBannerImage }: any) => {
  const dispatch = useDispatch();
  const router = useRouter()

  return (
    <div className="space-y-5">
      <FileUploader
        type="userBanner"
        defaultImage={userBannerImage || null}
        maxSizeMB={3}
        accept={["image/jpeg", "image/png", "image/webp"]}
        autoUpload={false}
        onSuccess={() => {
          router.refresh()
          dispatch(closeModal("UserBannerModel"));
        }}
      />
    </div>
  );
};

export default UserBannerImage;