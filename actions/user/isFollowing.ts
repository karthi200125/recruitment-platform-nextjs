"use server";

import { db } from "@/lib/db";

export async function isFollowing(
    currentUserId: number,
    targetUserId: number
): Promise<boolean> {
    try {        
        if (
            !Number.isInteger(currentUserId) ||
            !Number.isInteger(targetUserId) ||
            currentUserId <= 0 ||
            targetUserId <= 0
        ) {
            return false;
        }

        if (currentUserId === targetUserId) {
            return false;
        }

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
    } catch (error) {
        console.error("[isFollowing]", error);
        return false; 
    }
}