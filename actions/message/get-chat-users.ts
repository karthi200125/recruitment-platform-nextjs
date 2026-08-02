"use server";

import { db } from "@/lib/db";
import { ChatUserItem } from "@/types/chat";

export const getChatUsers = async (
    userId: number,
    q?: string
): Promise<ChatUserItem[]> => {
    try {
        const chats = await db.chats.findMany({
            where: {
                OR: [
                    { senderId: userId },
                    { receiverId: userId },
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
                        userImage: true,
                    },
                },

                receiver: {
                    select: {
                        id: true,
                        username: true,
                        userImage: true,
                    },
                },
            },
            orderBy: {
                updatedAt: "desc",
            },
        });

        const users: ChatUserItem[] = chats.map((chat) => {
            const chatUser =
                chat.senderId === userId
                    ? chat.receiver
                    : chat.sender;

            return {
                id: chatUser.id,
                username: chatUser.username,
                userImage: chatUser.userImage,
                lastMessage: chat.lastMessage,
                isSeen: chat.isSeen,
                createdAt: chat.createdAt,
                updatedAt: chat.updatedAt,
            };
        });

        if (!q) {
            return users;
        }

        const search = q.trim().toLowerCase();

        return users.filter((user) =>
            user.username
                .toLowerCase()
                .includes(search)
        );
    } catch (error) {
        console.error("[GET_CHAT_USERS]", error);
        return [];
    }
};