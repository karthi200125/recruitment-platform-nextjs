"use server";

import { db } from "@/lib/db";

const FREE_MESSAGE_LIMIT = 5;

export const createChatAndMessage = async (
    senderId: number,
    receiverId: number,
    messageText: string
) => {
    try {
        if (!senderId || !receiverId || !messageText) {
            throw new Error("Invalid input");
        }

        // 🔥 normalize users
        const [user1, user2] = [senderId, receiverId].sort(
            (a, b) => a - b
        );

        // 🔥 get sender (check plan)
        const sender = await db.user.findUnique({
            where: { id: senderId },
            select: { isPro: true },
        });

        if (!sender) throw new Error("User not found");

        // 🔥 find chat
        let chat = await db.chats.findUnique({
            where: {
                senderId_receiverId: {
                    senderId: user1,
                    receiverId: user2,
                },
            },
        });

        // 🔥 create chat if not exists
        if (!chat) {
            chat = await db.chats.create({
                data: {
                    senderId: user1,
                    receiverId: user2,
                    lastMessage: messageText,
                },
            });
        }

        // 🔥 LIMIT CHECK (FREE USERS)
        if (!sender.isPro) {
            const messageCount = await db.message.count({
                where: {
                    chatId: chat.id,
                    senderId,
                },
            });

            if (messageCount >= FREE_MESSAGE_LIMIT) {
                return {
                    success: false,
                    error: "LIMIT_REACHED",
                };
            }
        }

        // 🔥 create message
        const message = await db.message.create({
            data: {
                chatId: chat.id,
                senderId,
                text: messageText,
            },
        });

        // 🔥 update chat
        await db.chats.update({
            where: { id: chat.id },
            data: {
                lastMessage: messageText,
                updatedAt: new Date(),
            },
        });

        return {
            success: true,
            message,
        };
    } catch (error) {
        console.error("[createChatAndMessage]", error);

        return {
            success: false,
            error: "FAILED",
        };
    }
};