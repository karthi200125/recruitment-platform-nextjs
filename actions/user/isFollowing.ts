"use server";

import { db } from "@/lib/db";

export async function isFollowing(
    currentUserId: number,
    targetUserId: number
): Promise<boolean> {
    if (!currentUserId || !targetUserId) return false;

    const follow = await db.follow.findUnique({
        where: {
            followerId_followingId: {
                followerId: currentUserId,
                followingId: targetUserId,
            },
        },
        select: { id: true },
    });

    return !!follow;
}