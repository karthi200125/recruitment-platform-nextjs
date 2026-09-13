"use server";

import { db } from "@/lib/db";
import { ConversationData } from "@/types/chat";

const MAX_MESSAGES = 30;

export const getConversation = async (
    currentUserId: number,
    otherUserId: number
): Promise<ConversationData | null> => {
    try {
        // Validate IDs before hitting the database.
        if (
            currentUserId === undefined ||
            !Number.isInteger(currentUserId) ||
            !Number.isInteger(otherUserId) ||
            currentUserId <= 0 ||
            otherUserId <= 0 ||
            currentUserId === otherUserId
        ) {
            return null;
        }

        // Chats are stored using the lower user ID as senderId
        // and the higher user ID as receiverId.
        const [senderId, receiverId] = [
            currentUserId,
            otherUserId,
        ].sort((a, b) => a - b);

        const chat = await db.chats.findUnique({
            where: {
                senderId_receiverId: {
                    senderId,
                    receiverId,
                },
            },

            select: {
                id: true,

                messages: {
                    orderBy: {
                        createdAt: "asc",
                    },

                    take: MAX_MESSAGES,

                    select: {
                        id: true,
                        senderId: true,
                        text: true,
                        image: true,
                        file: true,
                        fileName: true,
                        fileType: true,
                        isSeen: true,
                        createdAt: true,

                        sender: {
                            select: {
                                id: true,
                                profileImage: true,
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
                    profileImage: message.sender.profileImage,
                },
            })),
        };
    } catch (error) {
        console.error("[getConversation]", error);
        return null;
    }
};