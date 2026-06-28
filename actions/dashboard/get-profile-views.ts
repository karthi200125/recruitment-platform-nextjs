'use server';

import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";

type GetWhoViewedYourProfileResult =
    | Prisma.ProfileViewGetPayload<{
        include: {
            viewer: true;
        };
    }>[]
    | { error: string };

export const getWhoViewedYourProfile = async (
    profileUserId: number
): Promise<GetWhoViewedYourProfileResult> => {
    try {
        return await db.profileView.findMany({
            where: {
                profileUserId,
            },
            include: {
                viewer: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    } catch (error) {
        console.error("[GET_PROFILE_VIEWERS]", error);

        return {
            error: "Failed to fetch profile viewers",
        };
    }
};