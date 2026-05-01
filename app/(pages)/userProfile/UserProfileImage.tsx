"use client";

import { ChangeEvent, useCallback, useState, useTransition } from "react";
import Image from "next/image";
import { useDispatch } from "react-redux";

import { updateImages } from "@/actions/user/updateImages";
import { deleteImages } from "@/actions/user/deleteImages";

import Button from "@/components/Button";
import { Progress } from "@/components/ui/progress";

import { useCustomToast } from "@/lib/CustomToast";
import { useUpload } from "@/lib/Uploadfile";

import { closeModal } from "@/app/Redux/ModalSlice";

import noProfile from "../../../public/noProfile.webp";

/* ────────────────────────────────────────────────
   Types
──────────────────────────────────────────────── */
interface ProfileUser {
    id: number;
    userImage?: string | null;
    role?: string | null;
}

interface CurrentUser {
    id: number;
    userImage?: string | null;
    role?: string | null;
}

interface Props {
    isCurrentUser?: boolean;
    profileUser?: ProfileUser | null;
    user?: CurrentUser | null;
}

/* ────────────────────────────────────────────────
   Component
──────────────────────────────────────────────── */
const UserProfileImage = ({
    isCurrentUser = false,
    profileUser,
    user,
}: Props) => {
    const dispatch = useDispatch();

    const [file, setFile] = useState<File | null>(null);
    const [showImage, setShowImage] = useState<string | null>(
        (isCurrentUser
            ? user?.userImage
            : profileUser?.userImage) || null
    );

    const [isPending, startTransition] = useTransition();

    const { showErrorToast, showSuccessToast } = useCustomToast();
    const { per, UploadFile, downloadUrl } = useUpload({ file });

    const userId = user?.id;

    /* ────────────────────────────────────────────────
       DELETE IMAGE
    ──────────────────────────────────────────────── */
    const handleDeleteImage = useCallback(async () => {
        if (!userId) return;

        try {
            const res = await deleteImages(
                userId,
                "user",
                user?.role
            );

            if (res.success) {
                showSuccessToast(res.success);
                setShowImage(null);
                dispatch(closeModal("profileImageModal"));
            } else {
                showErrorToast(res.error || "Delete failed");
            }
        } catch (err) {
            console.error("[deleteImage]", err);
            showErrorToast("Something went wrong");
        }
    }, [userId, user?.role, dispatch, showSuccessToast, showErrorToast]);

    /* ────────────────────────────────────────────────
       FILE SELECT
    ──────────────────────────────────────────────── */
    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if (!selected) return;

        setFile(selected);
        setShowImage(URL.createObjectURL(selected));
    };

    /* ────────────────────────────────────────────────
       UPLOAD
    ──────────────────────────────────────────────── */
    const handleUpload = useCallback(() => {
        if (!file) {
            showErrorToast("Please select a file to upload.");
            return;
        }

        UploadFile();
    }, [file, UploadFile, showErrorToast]);

    /* ────────────────────────────────────────────────
       UPDATE IMAGE
    ──────────────────────────────────────────────── */
    const handleUpdateImage = useCallback(() => {
        if (!userId || !downloadUrl) {
            showErrorToast("No image available for update.");
            return;
        }

        const isOrg = user?.role === "ORGANIZATION";

        startTransition(async () => {
            try {
                const res = await updateImages(
                    userId,
                    downloadUrl,
                    null,
                    isOrg
                );

                if (res.success) {
                    showSuccessToast(res.success);
                    dispatch(closeModal("profileImageModal"));
                } else {
                    showErrorToast(res.error || "Update failed");
                }
            } catch (err) {
                console.error("[updateImage]", err);
                showErrorToast("Something went wrong");
            }
        });
    }, [userId, downloadUrl, user?.role, dispatch, showSuccessToast, showErrorToast]);

    /* ────────────────────────────────────────────────
       Render
    ──────────────────────────────────────────────── */
    return (
        <div className="space-y-5">

            {/* IMAGE */}
            <div className="flex justify-center">
                <div className="relative w-[300px] h-[300px] rounded-full border overflow-hidden">

                    <Image
                        src={showImage || noProfile.src}
                        alt="User profile"
                        fill
                        className="object-cover bg-neutral-100"
                    />

                    {isCurrentUser && (
                        <>
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                id="imageupload"
                                onChange={handleImageUpload}
                            />

                            <label
                                htmlFor="imageupload"
                                className="absolute inset-0 flex items-center justify-center bg-black/60 cursor-pointer"
                            >
                                <span className="text-blue-400">
                                    Select Image
                                </span>
                            </label>
                        </>
                    )}
                </div>
            </div>

            {/* PROGRESS */}
            {per !== null && (
                <div className="space-y-2">
                    <p>{downloadUrl ? "Completed" : "Uploading..."}</p>
                    <Progress value={Number(per)} />
                </div>
            )}

            {/* ACTIONS */}
            {isCurrentUser && (
                <div className="flex items-center justify-between">

                    <button
                        onClick={handleDeleteImage}
                        className="text-sm font-bold text-red-500 border px-4 py-2 rounded-full"
                    >
                        Delete Image
                    </button>

                    <Button
                        onClick={downloadUrl ? handleUpdateImage : handleUpload}
                        isLoading={isPending}
                    >
                        {downloadUrl ? "Update Image" : "Upload Image"}
                    </Button>
                </div>
            )}
        </div>
    );
};

export default UserProfileImage;