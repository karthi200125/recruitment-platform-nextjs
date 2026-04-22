"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/db";

type ToggleFollowResponse = {
    success: boolean;
    isFollowing: boolean;
    error?: string;
};

export async function toggleFollow(
    targetUserId: number
): Promise<ToggleFollowResponse> {
    try {
        const session = await getServerSession(authOptions);
        const currentUserId = session?.user?.id;

        // ❌ Not logged in
        if (!currentUserId) {
            return { success: false, isFollowing: false, error: "Unauthorized" };
        }

        // ❌ Self follow
        if (currentUserId === targetUserId) {
            return {
                success: false,
                isFollowing: false,
                error: "You cannot follow yourself",
            };
        }

        // ✅ Transaction (safe toggle)
        const result = await db.$transaction(async (tx) => {
            const existingFollow = await tx.follow.findUnique({
                where: {
                    followerId_followingId: {
                        followerId: currentUserId,
                        followingId: targetUserId,
                    },
                },
                select: { id: true },
            });

            if (existingFollow) {
                await tx.follow.delete({
                    where: {
                        followerId_followingId: {
                            followerId: currentUserId,
                            followingId: targetUserId,
                        },
                    },
                });

                return { isFollowing: false };
            }

            await tx.follow.create({
                data: {
                    followerId: currentUserId,
                    followingId: targetUserId,
                },
            });

            return { isFollowing: true };
        });

        return {
            success: true,
            isFollowing: result.isFollowing,
        };
    } catch (error) {
        console.error("Toggle follow error:", error);

        return {
            success: false,
            isFollowing: false,
            error: "Something went wrong",
        };
    }
}