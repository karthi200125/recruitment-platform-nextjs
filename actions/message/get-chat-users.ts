"use server";

import { db } from "@/lib/db";

export const getChatUsers = async (
    userId: number,
    q?: string
) => {
    try {
        const chatUsers =
            await db.chats.findMany({
                where: {
                    OR: [
                        {
                            senderId: userId,
                        },
                        {
                            receiverId:
                                userId,
                        },
                    ],
                },
                select: {
                    id: true,
                    senderId: true,
                    receiverId: true,
                    lastMessage: true,
                    isSeen: true,
                    updatedAt: true,
                    createdAt: true,
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
                    updatedAt:
                        "desc",
                },
            });

        const formattedUsers =
            chatUsers.map((chat) => {
                const chatUser =
                    chat.senderId ===
                        userId
                        ? chat.receiver
                        : chat.sender;

                return {
                    id: chatUser.id,
                    username:
                        chatUser.username,
                    userImage:
                        chatUser.userImage,
                    lastMessage:
                        chat.lastMessage,
                    isSeen:
                    chat.isSeen,
                    updatedAt:
                        chat.updatedAt,
                    createdAt:
                        chat.createdAt,
                };
            });

        if (q) {
            const search =
                q.toLowerCase();

            return formattedUsers.filter(
                (user) =>
                    user.username
                        .toLowerCase()
                        .includes(search)
            );
        }

        return formattedUsers;
    } catch (error) {
        console.error(
            "[GET_CHAT_USERS]",
            error
        );

        return [];
    }
};

export type ChatUser = Awaited<ReturnType<typeof getChatUsers>>[number];