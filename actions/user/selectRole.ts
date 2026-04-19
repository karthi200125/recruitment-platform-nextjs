'use server';

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/db";

type ActionResponse = {
    success: boolean;
    error?: string;
};

export const selectRole = async (role: "CANDIDATE" | "RECRUITER" | "ORGANIZATION"): Promise<ActionResponse> => {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return { success: false, error: "Unauthorized" };
        }
        
        await db.user.update({
            where: { email: session.user.email },
            data: { role },
        });

        return { success: true };
    } catch (error) {
        console.error("[SELECT_ROLE_ERROR]", error);
        return { success: false, error: "Failed to update role" };
    }
};