"use server";

import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { getUserById, ProfileUser } from "./auth/getUserById";

type UserRole = "CANDIDATE" | "RECRUITER" | "ORGANIZATION";

interface CurrentUser {
    id: number;
    role?: UserRole;
}

export interface MoreProfileUser {
    id: number;
    username: string | null;
    userImage: string | null;
    profession: string | null;
    role: UserRole;
    isPro: boolean;
    isFollowing: boolean;
}

export const moreProUsers = async (
    currentUser: CurrentUser | null,
    profileUserId: number
): Promise<MoreProfileUser[]> => {
    // ── Validate input ─────────────────────────────────────────────
    if (!Number.isInteger(profileUserId)) {
        throw new Error("Invalid profile user ID");
    }

    // ── Fetch viewed profile ───────────────────────────────────────
    const res = await getUserById(profileUserId);

    if (!res.success || !res.data) {
        throw new Error(res.error || "Profile user not found");
    }

    const profileUser: ProfileUser = res.data;

    const isCurrentUser = currentUser?.id === profileUserId;

    // ✅ FIX: map relation → number[]
    const followers: number[] =
        profileUser.followers?.map((u) => u.id) ?? [];

    const userRole = profileUser.role as UserRole;

    // ── Build role-based query ────────────────────────────────────
    let whereClause: Prisma.UserWhereInput;

    switch (userRole) {
        case "CANDIDATE":
        case "RECRUITER":
            whereClause = {
                role: {
                    not: "ORGANIZATION",
                },
                id: isCurrentUser
                    ? { not: profileUserId }
                    : {
                        in: followers.length > 0 ? followers : [-1], // prevent empty IN
                        not: profileUserId,
                    },
            };
            break;

        case "ORGANIZATION":
            whereClause = {
                role: "ORGANIZATION",
                id: {
                    not: profileUserId,
                },
            };
            break;

        default:
            throw new Error("Unsupported user role");
    }

    // ── Query more profiles ───────────────────────────────────────
    const users = await db.user.findMany({
        where: whereClause,
        take: 8,
        select: {
            id: true,
            username: true,
            userImage: true,
            profession: true,
            role: true,
            isPro: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    // ── Get current user's following list ──────────────────────────
    const currentUserFollowings: number[] = currentUser
        ? (
            await db.user.findUnique({
                where: { id: currentUser.id },
                select: {
                    following: {
                        select: { id: true },
                    },
                },
            })
        )?.following.map((u) => u.id) ?? []
        : [];

    // ── Format result ─────────────────────────────────────────────
    const formattedUsers: MoreProfileUser[] = users.map((user) => ({
        id: user.id,
        username: user.username,
        userImage: user.userImage,
        profession: user.profession,
        role: user.role as UserRole,
        isPro: user.isPro ?? false,
        isFollowing: currentUserFollowings.includes(user.id),
    }));

    return formattedUsers;
};