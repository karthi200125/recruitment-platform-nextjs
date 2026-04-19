'use server';

import { db } from "@/lib/db";
import { getUserById, ProfileUser } from "../auth/getUserById";


interface NetworkUser {
    id: number;
    username: string;
    userImage: string | null;
    profession: string | null;
}

interface ActionResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}


export const getNetworkusers = async (
    userId: number,
    type: "followers" | "followings" = "followers"
): Promise<ActionResponse<NetworkUser[]>> => {
    try {
        // ✅ Validate input
        if (!userId || typeof userId !== "number") {
            return { success: false, error: "Invalid user ID" };
        }

        // ✅ Get user safely (unwrap ActionResponse)
        const res = await getUserById(userId);

        if (!res.success || !res.data) {
            return { success: false, error: res.error || "User not found" };
        }

        const currentUser: ProfileUser = res.data;

        // ✅ Extract IDs safely
        const ids =
            type === "followers"
                ? currentUser.followers ?? []
                : currentUser.followings ?? [];

        // ✅ Early return (important for performance)
        if (ids.length === 0) {
            return { success: true, data: [] };
        }

        // ✅ Optimized query (select only needed fields)
        const users = await db.user.findMany({
            where: {
                id: { in: ids },
            },
            select: {
                id: true,
                username: true,
                userImage: true,
                profession: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return {
            success: true,
            data: users,
        };
    } catch (error) {
        console.error("[getNetworkusers]", error);

        return {
            success: false,
            error: "Failed to fetch network users",
        };
    }
};