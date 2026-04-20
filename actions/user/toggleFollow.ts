"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/db";

type ToggleFollowResponse = {
    isFollowing: boolean;
};

export async function toggleFollow(
    targetUserId: number
): Promise<ToggleFollowResponse> {
    const session = await getServerSession(authOptions);

    const currentUserId = session?.user?.id;

    if (!currentUserId) {
        throw new Error("Unauthorized");
    }

    if (currentUserId === targetUserId) {
        throw new Error("You cannot follow yourself");
    }

    const existingFollow = await db.follow.findUnique({
        where: {
            followerId_followingId: {
                followerId: currentUserId,
                followingId: targetUserId,
            },
        },
        select: { id: true },
    });

    if (existingFollow) {
        await db.follow.delete({
            where: {
                followerId_followingId: {
                    followerId: currentUserId,
                    followingId: targetUserId,
                },
            },
        });

        return { isFollowing: false };
    }

    await db.follow.create({
        data: {
            followerId: currentUserId,
            followingId: targetUserId,
        },
    });

    return { isFollowing: true };
}