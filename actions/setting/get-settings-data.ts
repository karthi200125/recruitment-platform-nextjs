"use server";

import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth/authOptions";
import { db } from "@/lib/db";

export const getAccountData = async () => {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return null;
        }

        return await db.user.findUnique({
            where: {
                id: session.user.id,
            },
            select: {
                id: true,
                username: true,
                email: true,
                role: true,
                authProvider: true,
                createdAt: true,
            },
        });
    } catch (error) {
        console.error("[GET_ACCOUNT_DATA]", error);
        return null;
    }
};