"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authentication/authOptions";
import { db } from "@/lib/db";

interface DeleteAccountResult {
    success?: string;
    error?: string;
}

export const deleteAccount = async (): Promise<DeleteAccountResult> => {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return { error: "Unauthorized" };
        }

        const userId = Number(session.user.id);
        if (!userId) {
            return { error: "Unauthorized" };
        }

        await db.user.delete({ where: { id: userId } });

        return { success: "Account deleted." };
    } catch (error) {
        console.error("[DELETE_ACCOUNT]", error);
        return { error: "Failed to delete account. Please try again." };
    }
};