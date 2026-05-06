"use server";

import { db } from "@/lib/db";

export const getUnreadMessagesCount = async (
    userId: number
) => {
    try {
        if (!userId) return 0;

        const count = await db.message.count({
            where: {
                isSeen: false,

                // ✅ messages NOT sent by current user
                senderId: {
                    not: userId,
                },

                // ✅ messages inside chats where user participates
                chat: {
                    OR: [
                        { senderId: userId },
                        { receiverId: userId },
                    ],
                },
            },
        });

        return count;
    } catch (error) {
        console.error(
            "Error fetching unread messages count:",
            error
        );

        return 0;
    }
};