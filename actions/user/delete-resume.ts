"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authentication/authOptions";
import { db } from "@/lib/db";
import { deleteFromCloudinary } from "@/lib/upload/upload";

export async function deleteResume(): Promise<{
    success: boolean;
    error?: string;
}> {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return {
                success: false,
                error: "Unauthorized.",
            };
        }

        const userId = session.user.id;

        const user = await db.user.findUnique({
            where: { id: userId },
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

        if (!user.resume && !user.resumePublicId) {
            return {
                success: false,
                error: "No resume found.",
            };
        }

        if (user.resumePublicId) {
            await deleteFromCloudinary(user.resumePublicId);
        }

        await db.user.update({
            where: { id: userId },
            data: {
                resume: null,
                resumePublicId: null,
            },
        });

        return {
            success: true,
        };
    } catch (error) {
        console.error("[DELETE_RESUME]", error);

        return {
            success: false,
            error: "Unable to delete your resume.",
        };
    }
}