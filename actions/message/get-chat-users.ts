"use server";

import { db } from "@/lib/db";
import { ChatUserItem } from "@/types/chat";

export const getChatUsers = async (
    userId: number,
    q?: string
): Promise<ChatUserItem[]> => {
    try {
        if (!Number.isInteger(userId) || userId <= 0) {
            return [];
        }

        const search = q?.trim();

        const chats = await db.chats.findMany({
            where: {
                OR: [
                    {
                        senderId: userId,
                        ...(search
                            ? {
                                receiver: {
                                    username: {
                                        contains: search,
                                        mode: "insensitive",
                                    },
                                },
                            }
                            : {}),
                    },
                    {
                        receiverId: userId,
                        ...(search
                            ? {
                                sender: {
                                    username: {
                                        contains: search,
                                        mode: "insensitive",
                                    },
                                },
                            }
                            : {}),
                    },
                ],
            },

            select: {
                id: true,
                senderId: true,
                receiverId: true,
                lastMessage: true,
                isSeen: true,
                createdAt: true,
                updatedAt: true,

                sender: {
                    select: {
                        id: true,
                        username: true,
                        profileImage: true,
                    },
                },

                receiver: {
                    select: {
                        id: true,
                        username: true,
                        profileImage: true,
                    },
                },
            },

            orderBy: {
                updatedAt: "desc",
            },
        });

        return chats.map((chat) => {
            const chatUser =
                chat.senderId === userId
                    ? chat.receiver
                    : chat.sender;

            return {
                id: chatUser.id,
                username: chatUser.username,
                profileImage: chatUser.profileImage,
                lastMessage: chat.lastMessage,
                isSeen: chat.isSeen,
                createdAt: chat.createdAt,
                updatedAt: chat.updatedAt,
            };
        });
    } catch (error) {
        console.error("[GET_CHAT_USERS]", error);

        return [];
    }
};