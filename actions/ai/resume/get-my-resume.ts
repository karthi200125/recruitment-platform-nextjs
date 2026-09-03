"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authentication/authOptions";
import { db } from "@/lib/db";

export async function getMyResume() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return {
                success: false,
                error: "Unauthorized.",
            };
        }

        const user = await db.user.findUnique({
            where: { id: session.user.id },
            select: {
                resume: true,
                resumePublicId: true,
            },
        });

        if (!user) {
            return {
                success: false,
                error: "User not found.",
            };
        }

        return {
            success: true,
            data: {
                resume: user.resume,
                resumePublicId: user.resumePublicId,
            },
        };
    } catch (error) {
        console.error("[GET_MY_RESUME]", error);

        return {
            success: false,
            error: "Unable to load your resume.",
        };
    }
}