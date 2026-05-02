"use server";

import { db } from "@/lib/db";

interface ConversationData {
    id: number;
    messages: {
        id: number;
        senderId: number;
        text?: string | null;
        image?: string | null;
        isSeen: boolean;
        createdAt: string;
        sender: {
            id: number;
            userImage?: string | null;
        };
    }[];
}

type GetConversationResult = ConversationData | null;

export const getConversation = async (
    currentUserId: number,
    otherUserId: number
): Promise<GetConversationResult> => {
    try {
        if (
            !Number.isInteger(currentUserId) ||
            !Number.isInteger(otherUserId)
        ) {
            throw new Error("Invalid user IDs");
        }

        const [user1, user2] = [currentUserId, otherUserId].sort(
            (a, b) => a - b
        );

        const chat = await db.chats.findUnique({
            where: {
                senderId_receiverId: {
                    senderId: user1,
                    receiverId: user2,
                },
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

        if (!chat) return null;

        // 🔥 IMPORTANT: convert Date → string
        return {
            id: chat.id,
            messages: chat.messages.map((msg) => ({
                ...msg,
                createdAt: msg.createdAt.toISOString(), 
            })),
        };
    } catch (error) {
        console.error("[getConversation]", error);
        return null;
    }
};