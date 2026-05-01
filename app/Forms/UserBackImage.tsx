'use client';

import { deleteImages } from "@/actions/user/deleteImages";
import { updateImages } from "@/actions/user/updateImages";
import { closeModal } from "@/app/Redux/ModalSlice";
import Button from "@/components/Button";
import { Progress } from "@/components/ui/progress";
import { useCustomToast } from "@/lib/CustomToast";
import { useUpload } from "@/lib/Uploadfile";
import Image from "next/image";
import { ChangeEvent, useCallback, useState, useTransition } from "react";
import { useDispatch } from "react-redux";

const UserProfileImage = ({ isCurrentUser, profileUser, user }: any) => {

    const dispatch = useDispatch();

    const [file, setFile] = useState<File | null>(null);
    const [showImage, setShowImage] = useState<string | null>((!isCurrentUser ? profileUser?.userImage : user?.userImage) || null);
    const [isPending, startTransition] = useTransition();

    const { showErrorToast, showSuccessToast } = useCustomToast();
    const { per, UploadFile, downloadUrl } = useUpload({ file });

    const userId = user?.id;

    const handleDeleteImage = useCallback(async () => {
        if (!userId) return;

        const response = await deleteImages(userId, "user", user?.role);
        if (response.success) {
            showSuccessToast(response.success);
            dispatch(closeModal("profileImageModal"));
            setShowImage(null);
        } else if (response.error) {
            showErrorToast(response.error);
        }
    }, [userId, dispatch, showSuccessToast, showErrorToast]);

    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setShowImage(URL.createObjectURL(selectedFile));
        }
    };

    const handleUpload = useCallback(() => {
        if (file) {
            UploadFile();
        } else {
            showErrorToast("Please select a file to upload.");
        }
    }, [file, UploadFile, showErrorToast]);

    const handleUpdateImage = useCallback(async () => {
        if (!downloadUrl) {
            showErrorToast("No image URL available for update.");
            return;
        }

        const isOrg = user?.role === "ORGANIZATION"

        startTransition(async () => {
            const response = await updateImages(userId, downloadUrl, null, isOrg);
            if (response.success) {
                dispatch(closeModal("profileImageModal"));
                showSuccessToast(response.success);
            } else if (response.error) {
                showErrorToast(response.error);
            }
        });
    }, [userId, downloadUrl, dispatch, startTransition, showSuccessToast, showErrorToast]);

    return (
        <div className="space-y-5">
            <div className="flexcenter">
                <div className="relative w-[300px] h-[300px] rounded-full border overflow-hidden">
                    <Image
                        src={showImage || '/noProfile.webp'}
                        alt="User profile"
                        fill
                        className="w-full h-full object-cover bg-neutral-100 absolute top-0 left-0"
                    />
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        id="imageupload"
                        onChange={handleImageUpload}
                    />
                    {isCurrentUser &&
                        <label
                            htmlFor="imageupload"
                            className="absolute top-0 left-0 w-full h-full opacity-70 z-10 flex items-center justify-center cursor-pointer transition bg-black"
                        >
                            <div className="space-y-3 text-center">
                                <h3 className="text-blue-400 z-10">Select Image</h3>
                            </div>
                        </label>
                    }
                </div>
            </div>

            {per !== null && (
                <div className="space-y-3">
                    <h3>{downloadUrl ? "Completed" : "Uploading..."}</h3>
                    <Progress value={Number(per)} className="w-full" />
                </div>
            )}

            {isCurrentUser &&
                <div className="flex flex-row items-center justify-between">
                    <h3
                        className="text-sm font-bold text-red-500 cursor-pointer py-2 px-5 border rounded-full"
                        onClick={handleDeleteImage}
                    >
                        Delete Image
                    </h3>
                    <Button
                        className="!py-2"
                        onClick={downloadUrl ? handleUpdateImage : handleUpload}
                        isLoading={isPending}
                    >
                        {downloadUrl ? "Update Image" : "Upload Image"}
                    </Button>
                </div>
            }
        </div>
    );
};

export default UserProfileImage;
