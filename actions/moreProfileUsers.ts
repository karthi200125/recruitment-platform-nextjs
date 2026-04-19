"use server";

import { db } from "@/lib/db";
import { getUserById, ProfileUser } from "./auth/getUserById";

type UserRole = "CANDIDATE" | "RECRUITER" | "ORGANIZATION";

interface CurrentUser {
    id: number;
    role?: UserRole;
}

export const moreProUsers = async (
    currentUser: CurrentUser | null,
    profileUserId: number
) => {
    // ── Validate input ─────────────────────────────────────────────
    if (!Number.isInteger(profileUserId)) {
        throw new Error("Invalid profile user ID");
    }

    // ── Fetch viewed profile ───────────────────────────────────────
    const res = await getUserById(profileUserId);

    if (!res.success || !res.data) {
        throw new Error(res.error || "Profile user not found");
    }

    const profileUser: ProfileUser = res.data; // ✅ unwrap once

    const isCurrentUser = currentUser?.id === profileUserId;

    const followers: number[] = profileUser.followers ?? [];

    const userRole = profileUser.role as UserRole;

    // ── Build role-based query ────────────────────────────────────
    let whereClause: Record<string, unknown>;

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
                        in: followers,
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

    return users;
};