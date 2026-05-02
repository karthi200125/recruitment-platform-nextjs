"use server";

import { db } from "@/lib/db";

interface MarkMessagesAsSeenResult {
    success: boolean;
    updatedCount?: number;
    error?: string;
}

export const markMessagesAsSeen = async (
    chatId: number,
    userId: number
): Promise<MarkMessagesAsSeenResult> => {
    try {
        if (
            !Number.isInteger(chatId) ||
            !Number.isInteger(userId)
        ) {
            throw new Error("Invalid chatId or userId");
        }

        const result = await db.message.updateMany({
            where: {
                chatId,
                senderId: {
                    not: userId,
                },
                isSeen: false,
                isDeleted: false,
            },
            data: {
                isSeen: true,
            },
        });

        return {
            success: true,
            updatedCount: result.count,
        };
    } catch (error) {
        console.error(
            "[markMessagesAsSeen] Failed to update messages:",
            error
        );

        return {
            success: false,
            error: "Failed to mark messages as seen.",
        };
    }
};