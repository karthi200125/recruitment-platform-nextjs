"use server";

import { db } from "@/lib/db";
import { ConversationData } from "@/types/chat";

export const getConversation = async (
    currentUserId: number,
    otherUserId: number
): Promise<ConversationData | null> => {
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
                    orderBy: {
                        createdAt: "asc",
                    },
                    take: 30,
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

        if (!chat) {
            return null;
        }

        return {
            id: chat.id,
            messages: chat.messages.map((message) => ({
                id: message.id,
                senderId: message.senderId,
                text: message.text,
                image: message.image,
                file: message.file,
                fileName: message.fileName,
                fileType: message.fileType,
                isSeen: message.isSeen,
                createdAt: message.createdAt.toISOString(),
                sender: {
                    id: message.sender.id,
                    userImage: message.sender.userImage,
                },
            })),
        };
    } catch (error) {
        console.error("[getConversation]", error);
        return null;
    }
};