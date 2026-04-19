
"use server";

import { db } from "@/lib/db";
import { getUserById } from "@/actions/auth/getUserById";

export const UserFollowAction = async (
    currentUserId: number,
    targetUserId: number
) => {
    try {
        // ── Validate IDs ─────────────────────────────────────────────
        if (
            !Number.isInteger(currentUserId) ||
            !Number.isInteger(targetUserId)
        ) {
            throw new Error("Invalid user ID");
        }

        if (currentUserId === targetUserId) {
            return { error: "You cannot follow yourself." };
        }

        // ── Fetch both users in parallel ─────────────────────────────
        const [currentUser, targetUser] = await Promise.all([
            getUserById(currentUserId),
            getUserById(targetUserId),
        ]);

        if (!currentUser || !targetUser) {
            return { error: "User not found." };
        }

        const currentFollowings: number[] = currentUser.followings ?? [];
        const targetFollowers: number[] = targetUser.followers ?? [];

        const isFollowing = currentFollowings.includes(targetUserId);

        // ── Prepare updated arrays ───────────────────────────────────
        const updatedFollowings = isFollowing
            ? currentFollowings.filter((id) => id !== targetUserId)
            : [...currentFollowings, targetUserId];

        const updatedFollowers = isFollowing
            ? targetFollowers.filter((id) => id !== currentUserId)
            : [...targetFollowers, currentUserId];

        // ── Atomic transaction ───────────────────────────────────────
        await db.$transaction([
            db.user.update({
                where: { id: currentUserId },
                data: {
                    followings: {
                        set: updatedFollowings,
                    },
                },
            }),

            db.user.update({
                where: { id: targetUserId },
                data: {
                    followers: {
                        set: updatedFollowers,
                    },
                },
            }),
        ]);

        return {
            success: isFollowing
                ? `${targetUser.username} has been unfollowed`
                : `${targetUser.username} has been followed`,
            isFollowing: !isFollowing,
        };
    } catch (error) {
        console.error("[UserFollowAction]", error);

        return {
            error: "Failed to update follow status. Please try again.",
        };
    }
};

