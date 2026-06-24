"use server";

import { db } from "@/lib/db";

export const getChatUsers = async (userId: number, q?: string) => {

    try {
        const chatusers: any = await db.chats.findMany({
            where: {
                OR: [
                    { senderId: userId },
                    { receiverId: userId }
                ]
            },
            select: {
                id: true,
                senderId: true,
                receiverId: true,
                lastMessage: true,                
                updatedAt: true,
                createdAt: true,
                sender: {
                    select: { id: true, username: true, userImage: true }
                },
                receiver: {
                    select: { id: true, username: true, userImage: true }
                }
            },
            orderBy: {
                updatedAt: "desc",
            }
        });
        
        const formattedUsers = chatusers.map((chat: any) => {
            const chatUser = chat.senderId === userId ? chat.receiver : chat.sender;
            return {
                id: chatUser.id,
                username: chatUser.username,
                userImage: chatUser.userImage,
                lastMessage: chat.lastMessage,
                isSeen: chat.isSeen,
                updatedAt: chat.updatedAt,
                createdAt: chat.createdAt
            };
        });
        
        if (q) {
            return formattedUsers.filter((user: any) =>
                user.username.toLowerCase().includes(q.toLowerCase())
            );
        }

        return formattedUsers;
    } catch (error) {
        console.error("Error fetching chat users:", error);
        return [];
    }
};
