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
        // ✅ validation
        if (
            !Number.isInteger(chatId) ||
            !Number.isInteger(userId)
        ) {
            throw new Error("Invalid chatId or userId");
        }

        // ✅ verify chat exists
        const chat = await db.chats.findUnique({
            where: {
                id: chatId,
            },

            select: {
                id: true,
            },
        });

        if (!chat) {
            return {
                success: false,
                error: "Chat not found",
            };
        }

        // ✅ mark unseen messages from OTHER user
        const result = await db.message.updateMany({
            where: {
                chatId,

                // ✅ only messages NOT sent by current user
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
            "[markMessagesAsSeen]",
            error
        );

        return {
            success: false,
            error: "Failed to mark messages as seen",
        };
    }
};