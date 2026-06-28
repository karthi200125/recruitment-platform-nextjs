"use server";

import { db } from "@/lib/db";

export const isFollowing = async (
    currentUserId: number,
    targetUserId: number
): Promise<boolean> => {
    try {
        if (
            !Number.isInteger(currentUserId) ||
            !Number.isInteger(targetUserId) ||
            currentUserId <= 0 ||
            targetUserId <= 0 ||
            currentUserId === targetUserId
        ) {
            return false;
        }

        const existingFollow = await db.follow.findUnique({
            where: {
                followerId_followingId: {
                    followerId: currentUserId,
                    followingId: targetUserId,
                },
            },
            select: {
                id: true,
            },
        });

        return Boolean(existingFollow);
    } catch (error) {
        console.error("[IS_FOLLOWING]", error);

        return false;
    }
};