
"use server";

import { db } from "@/lib/db";

export const getConversation = async (
    currentUserId: number,
    otherUserId: number
) => {
    try {
        if (
            !Number.isInteger(currentUserId) ||
            !Number.isInteger(otherUserId)
        ) {
            throw new Error("Invalid user IDs");
        }

        const chat = await db.chats.findFirst({
            where: {
                OR: [
                    {
                        senderId: currentUserId,
                        receiverId: otherUserId,
                    },
                    {
                        senderId: otherUserId,
                        receiverId: currentUserId,
                    },
                ],
            },
            include: {
                messages: {
                    take: 30,
                    orderBy: {
                        createdAt: "asc",
                    },
                    include: {
                        sender: {
                            select: {
                                id: true,
                                userImage: true,
                            },
                        },
                    },
                },
            },
        });

        return chat;
    } catch (error) {
        console.error(
            "[getConversation] Failed to fetch conversation:",
            error
        );

        return null;
    }
};

