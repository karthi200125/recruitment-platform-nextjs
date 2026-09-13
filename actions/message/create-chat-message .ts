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
        // ─────────────────────────────────────────────────────────────
        // Validation
        // ─────────────────────────────────────────────────────────────

        if (
            !Number.isInteger(senderId) ||
            senderId <= 0 ||
            !Number.isInteger(receiverId) ||
            receiverId <= 0 ||
            senderId === receiverId
        ) {
            return {
                success: false,
                error: "INVALID_INPUT",
            };
        }

        const text = messageText?.trim() || null;
        const messageImage = image || null;
        const messageFile = file || null;

        if (!text && !messageImage && !messageFile) {
            return {
                success: false,
                error: "INVALID_INPUT",
            };
        }

        // ─────────────────────────────────────────────────────────────
        // Normalize chat participants
        // ─────────────────────────────────────────────────────────────

        const [user1, user2] = [senderId, receiverId].sort(
            (a, b) => a - b
        );

        // ─────────────────────────────────────────────────────────────
        // Get sender
        // ─────────────────────────────────────────────────────────────

        const sender = await db.user.findUnique({
            where: {
                id: senderId,
            },
            select: {
                isPro: true,
            },
        });

        if (!sender) {
            return {
                success: false,
                error: "USER_NOT_FOUND",
            };
        }

        // ─────────────────────────────────────────────────────────────
        // Get or create chat
        // ─────────────────────────────────────────────────────────────

        let chat = await db.chats.findUnique({
            where: {
                senderId_receiverId: {
                    senderId: user1,
                    receiverId: user2,
                },
            },
            select: {
                id: true,
            },
        });

        if (!chat) {
            chat = await db.chats.create({
                data: {
                    senderId: user1,
                    receiverId: user2,
                    lastMessage:
                        text ||
                        (messageImage
                            ? "📷 Image"
                            : "📎 File"),
                    lastMessageAt: new Date(),
                },
                select: {
                    id: true,
                },
            });
        }

        // ─────────────────────────────────────────────────────────────
        // Free plan limit
        // ─────────────────────────────────────────────────────────────

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

        // ─────────────────────────────────────────────────────────────
        // Create message + update chat preview
        // ─────────────────────────────────────────────────────────────

        const now = new Date();

        const [message] = await db.$transaction([
            db.message.create({
                data: {
                    chatId: chat.id,
                    senderId,

                    text,

                    image: messageImage,

                    file: messageFile,
                    fileName: fileName || null,
                    fileType: fileType || null,
                },

                select: {
                    id: true,
                    chatId: true,
                    senderId: true,
                    text: true,
                    image: true,
                    file: true,
                    fileName: true,
                    fileType: true,
                    isSeen: true,
                    createdAt: true,
                },
            }),

            db.chats.update({
                where: {
                    id: chat.id,
                },
                data: {
                    lastMessage:
                        text ||
                        (messageImage
                            ? "📷 Image"
                            : "📎 File"),
                    lastMessageAt: now,
                    updatedAt: now,
                },
            }),
        ]);

        return {
            success: true,
            message,
        };
    } catch (error) {
        console.error(
            "[createChatAndMessage]",
            error
        );

        return {
            success: false,
            error: "FAILED",
        };
    }
};