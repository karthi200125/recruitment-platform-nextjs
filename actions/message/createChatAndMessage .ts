"use server";

import { db } from "@/lib/db";

const FREE_MESSAGE_LIMIT = 5;

export const createChatAndMessage = async (
    senderId: number,
    receiverId: number,
    messageText?: string,
    image?: string,
    file?: string,
    fileName?: string,
    fileType?: string
) => {
    try {
        // ✅ validation
        if (
            !senderId ||
            !receiverId ||
            (!messageText && !image && !file)
        ) {
            throw new Error("Invalid input");
        }

        // ✅ normalize users
        const [user1, user2] = [senderId, receiverId].sort(
            (a, b) => a - b
        );

        // ✅ get sender
        const sender = await db.user.findUnique({
            where: { id: senderId },
            select: { isPro: true },
        });

        if (!sender) {
            throw new Error("User not found");
        }

        // ✅ find existing chat
        let chat = await db.chats.findUnique({
            where: {
                senderId_receiverId: {
                    senderId: user1,
                    receiverId: user2,
                },
            },
        });

        // ✅ create chat if not exists
        if (!chat) {
            chat = await db.chats.create({
                data: {
                    senderId: user1,
                    receiverId: user2,
                    lastMessage:
                        messageText ||
                        (image ? "📷 Image" : "📎 File"),

                    lastMessageAt: new Date(),
                },
            });
        }

        // ✅ FREE PLAN LIMIT
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

        // ✅ create message
        const message = await db.message.create({
            data: {
                chatId: chat.id,
                senderId,

                text: messageText || null,

                image: image || null,

                file: file || null,
                fileName: fileName || null,
                fileType: fileType || null,
            },
        });

        // ✅ update chat preview
        await db.chats.update({
            where: { id: chat.id },
            data: {
                lastMessage:
                    messageText ||
                    (image ? "📷 Image" : "📎 File"),

                lastMessageAt: new Date(),
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