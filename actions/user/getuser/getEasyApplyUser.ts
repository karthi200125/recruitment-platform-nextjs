"use server";

import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/authentication/authOptions";
import { db } from "@/lib/db";

import type { EasyApplyUser } from "@/types/easyApply";

export const getEasyApplyUser = async (): Promise<EasyApplyUser | null> => {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return null;
        }

        const user = await db.user.findUnique({
            where: {
                id: session.user.id,
            },
            select: {
                username: true,
                firstName: true,
                lastName: true,
                email: true,
                profession: true,
                phoneNo: true,

                profileImage: true,
                profileImagePublicId: true,

                city: true,
                state: true,
                country: true,

                resume: true,
                resumePublicId: true,
            },
        });

        return user;
    } catch (error) {
        console.error("[GET_EASY_APPLY_USER]", error);
        return null;
    }
};