"use client";

import { useCallback, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";

import {
    Crown,
    ImageIcon,
    Loader2,
    Paperclip,
    SendHorizonal,
} from "lucide-react";

import { useUpload } from "@/hooks/useUpload";
import type { UploadType } from "@/lib/upload/upload-types";
import { createChatAndMessage } from "@/actions/message/create-chat-message ";

interface ChatButtonProps {
    userId: number;
    receiverId: number;
}

export const ChatButton = ({
    userId,
    receiverId,
}: ChatButtonProps) => {
    const queryClient = useQueryClient();

    const [messageText, setMessageText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [limitReached, setLimitReached] = useState(false);

    const {
        upload,
        isUploading,
    } = useUpload();

    const handleSend = useCallback(
        async (
            image?: string,
            file?: string,
            fileName?: string,
            fileType?: string
        ) => {
            const trimmed = messageText.trim();

            if (!trimmed && !image && !file) {
                return;
            }

            try {
                setIsLoading(true);

                const result = await createChatAndMessage(
                    userId,
                    receiverId,
                    trimmed,
                    image,
                    file,
                    fileName,
                    fileType
                );

                if (result?.error === "LIMIT_REACHED") {
                    setLimitReached(true);
                    return;
                }

                if (result?.success) {
                    setMessageText("");

                    await Promise.all([
                        queryClient.invalidateQueries({
                            queryKey: [
                                "conversation",
                                userId,
                                receiverId,
                            ],
                        }),
                        queryClient.invalidateQueries({
                            queryKey: [
                                "chatUsers",
                                userId,
                            ],
                        }),
                    ]);
                }
            } catch (error) {
                console.error(
                    "[CHAT_SEND]",
                    error
                );
            } finally {
                setIsLoading(false);
            }
        },
        [
            messageText,
            queryClient,
            receiverId,
            userId,
        ]
    );

    const uploadAndSend = useCallback(
        async (
            file: File,
            type: UploadType
        ) => {
            const uploaded = await upload({
                file,
                type,
            });

            if (type === "chat-image") {
                await handleSend(uploaded.url);
                return;
            }

            await handleSend(
                undefined,
                uploaded.url,
                file.name,
                file.type
            );
        },
        [handleSend, upload]
    );

    const handleImageUpload = useCallback(
        async (
            e: React.ChangeEvent<HTMLInputElement>
        ) => {
            const file =
                e.target.files?.[0];

            if (!file) return;

            try {
                await uploadAndSend(
                    file,
                    "chat-image"
                );
            } catch (error) {
                console.error(
                    "[CHAT_IMAGE_UPLOAD]",
                    error
                );
            } finally {
                e.target.value = "";
            }
        },
        [uploadAndSend]
    );

    const handleFileUpload = useCallback(
        async (
            e: React.ChangeEvent<HTMLInputElement>
        ) => {
            const file =
                e.target.files?.[0];

            if (!file) return;

            try {
                await uploadAndSend(
                    file,
                    "chat-file"
                );
            } catch (error) {
                console.error(
                    "[CHAT_FILE_UPLOAD]",
                    error
                );
            } finally {
                e.target.value = "";
            }
        },
        [uploadAndSend]
    );

    const handleKeyDown = (
        e: React.KeyboardEvent<HTMLInputElement>
    ) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSend();
        }
    };


    /* ================= LIMIT ================= */
    if (limitReached) {
        return (
            <div className="flex items-center justify-between gap-3 border-t border-amber-200 bg-amber-50 px-4 py-3">

                <div className="flex items-center gap-2">
                    <Crown
                        className="h-4 w-4 text-amber-500"
                        strokeWidth={2}
                    />

                    <p className="text-xs font-medium text-amber-700">
                        Free message limit reached.
                    </p>
                </div>

                <Link
                    href="/subscriptions"
                    className="text-xs font-semibold text-amber-700 underline underline-offset-4 hover:text-amber-800"
                >
                    Upgrade
                </Link>

            </div>
        );
    }

    return (
        <div className="flex flex-shrink-0 items-center gap-2 border-t border-slate-200 bg-white px-3 py-3">

            {/* File Upload */}
            <label
                htmlFor="chat-file"
                aria-label="Attach file"
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-100 disabled:pointer-events-none disabled:opacity-50"
            >
                <Paperclip
                    className="h-4 w-4"
                    strokeWidth={2}
                />
            </label>

            <input
                id="chat-file"
                type="file"
                hidden
                disabled={isLoading || isUploading}
                accept=".pdf,.doc,.docx,.zip"
                onChange={handleFileUpload}
            />

            {/* Image Upload */}
            <label
                htmlFor="chat-image"
                aria-label="Upload image"
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-100 disabled:pointer-events-none disabled:opacity-50"
            >
                <ImageIcon
                    className="h-4 w-4"
                    strokeWidth={2}
                />
            </label>

            <input
                id="chat-image"
                type="file"
                hidden
                disabled={isLoading || isUploading}
                accept="image/png,image/jpeg,image/webp,image/gif"
                onChange={handleImageUpload}
            />

            {/* Message */}
            <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading || isUploading}
                placeholder="Type a message..."
                className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm outline-none transition placeholder:text-slate-400 focus:border-[var(--primary-clr)] focus:bg-white"
            />

            {/* Send */}
            <button
                type="button"
                aria-label="Send message"
                onClick={() => void handleSend()}
                disabled={
                    isLoading ||
                    isUploading ||
                    messageText.trim().length === 0
                }
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary-clr)] text-white transition hover:bg-[var(--primary-hover-clr)] disabled:cursor-not-allowed disabled:opacity-50"
            >
                {isLoading || isUploading ? (
                    <Loader2
                        className="h-4 w-4 animate-spin"
                        strokeWidth={2}
                    />
                ) : (
                    <SendHorizonal
                        className="h-4 w-4"
                        strokeWidth={2}
                    />
                )}
            </button>

        </div>
    );
}