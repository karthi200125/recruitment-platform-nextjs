
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
        /* ────────────────────────────────────────────────
           Validate Input
        ──────────────────────────────────────────────── */
        if (
            !Number.isInteger(viewerUserId) ||
            !Number.isInteger(profileUserId)
        ) {
            return {
                error: "Invalid user IDs provided.",
            };
        }

        /* Prevent Self Profile View Tracking */
        if (viewerUserId === profileUserId) {
            return {
                message: "Cannot track self profile view.",
            };
        }

        /* ────────────────────────────────────────────────
           Fetch Existing Profile Views
        ──────────────────────────────────────────────── */
        const profileUser = await db.user.findUnique({
            where: {
                id: profileUserId,
            },
            select: {
                ProfileViews: true,
            },
        });

        if (!profileUser) {
            return {
                error: "Profile user not found.",
            };
        }

        const existingViews = profileUser.ProfileViews ?? [];

        /* Prevent Duplicate Views */
        if (existingViews.includes(viewerUserId)) {
            return {
                message: "Profile already viewed by this user.",
            };
        }

        /* ────────────────────────────────────────────────
           Update Profile Views
        ──────────────────────────────────────────────── */
        await db.user.update({
            where: {
                id: profileUserId,
            },
            data: {
                ProfileViews: {
                    push: viewerUserId,
                },
            },
        });

        return {
            success: "Profile view recorded successfully.",
        };
    } catch (error) {
        console.error(
            "[updateProfileViews] Failed to update profile views:",
            error
        );

        return {
            error: "Failed to update profile views.",
        };
    }
};

