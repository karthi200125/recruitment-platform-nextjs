"use server";

import { db } from "@/lib/db";

interface UpdateProfileViewsResult {
    success?: string;
    message?: string;
    error?: string;
}

export const updateProfileViews = async (
    viewerUserId: number,
    profileUserId: number
): Promise<UpdateProfileViewsResult> => {
    try {
        if (
            !Number.isInteger(viewerUserId) ||
            !Number.isInteger(profileUserId)
        ) {
            return {
                error: "Invalid user IDs provided.",
            };
        }

        if (viewerUserId === profileUserId) {
            return {
                message: "Cannot track self profile view.",
            };
        }

        const profileExists = await db.user.findUnique({
            where: {
                id: profileUserId,
            },
            select: {
                id: true,
            },
        });

        if (!profileExists) {
            return {
                error: "Profile user not found.",
            };
        }

        const existingView = await db.profileView.findFirst({
            where: {
                profileUserId,
                viewerUserId,
            },
            select: {
                id: true,
            },
        });

        if (existingView) {
            return {
                message: "Profile already viewed by this user.",
            };
        }
        
        await db.profileView.create({
            data: {
                profileUserId,
                viewerUserId,
            },
        });

        return {
            success: "Profile view recorded successfully.",
        };
    } catch (error) {
        console.error("[UPDATE_PROFILE_VIEWS]", error);

        return {
            error: "Failed to update profile views.",
        };
    }
};