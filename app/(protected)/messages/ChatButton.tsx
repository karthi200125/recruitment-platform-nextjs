"use client";

import { useCallback, useRef, useState, useTransition } from "react";
import { ImageIcon, Loader2, Paperclip, SendHorizonal } from "lucide-react";

import { createChatAndMessage } from "@/actions/message/create-chat-message ";
import { useUpload } from "@/hooks/useUpload";
import type { UploadType } from "@/lib/upload/upload-types";

export interface OptimisticMessage {
    tempId: string;
    senderId: number;
    text: string | null;
    image: string | null;
    file: string | null;
    fileName: string | null;
    fileType: string | null;
    createdAt: string;
    status: "sending" | "error";
}

interface ChatButtonProps {
    userId: number;
    receiverId: number;
    onOptimisticMessage: (message: OptimisticMessage) => void;
    onOptimisticError: (tempId: string) => void;
}

export const ChatButton = ({
    userId,
    receiverId,
    onOptimisticMessage,
    onOptimisticError,
}: ChatButtonProps) => {
    const [messageText, setMessageText] = useState("");
    const [isPending, startTransition] = useTransition();

    const fileInputRef = useRef<HTMLInputElement>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);

    const {
        upload,
        isUploading,
    } = useUpload();

    const isBusy = isPending || isUploading;

    /*
     * ------------------------------------------------------------
     * SEND TEXT
     * ------------------------------------------------------------
     */
    const sendText = useCallback(() => {
        const trimmed = messageText.trim();

        if (!trimmed || isBusy) {
            return;
        }

        const tempId = `temp-${crypto.randomUUID()}`;

        const optimisticMessage: OptimisticMessage = {
            tempId,
            senderId: userId,
            text: trimmed,
            image: null,
            file: null,
            fileName: null,
            fileType: null,
            createdAt: new Date().toISOString(),
            status: "sending",
        };

        /*
         * Show immediately.
         */
        startTransition(() => {
            onOptimisticMessage(optimisticMessage);
        });

        /*
         * Clear input immediately.
         */
        setMessageText("");

        /*
         * Backend work happens asynchronously.
         */
        void (async () => {
            try {
                const result = await createChatAndMessage(
                    userId,
                    receiverId,
                    trimmed
                );

                if (result?.error === "LIMIT_REACHED") {
                    onOptimisticError(tempId);
                    return;
                }

                if (!result?.success) {
                    throw new Error("Failed to send message");
                }
            } catch (error) {
                console.error("[CHAT_SEND]", error);
                onOptimisticError(tempId);
            }
        })();
    }, [
        messageText,
        isBusy,
        userId,
        receiverId,
        onOptimisticMessage,
        onOptimisticError,
    ]);

    /*
     * ------------------------------------------------------------
     * UPLOAD + SEND
     * ------------------------------------------------------------
     */
    const uploadAndSend = useCallback(
        async (
            selectedFile: File,
            type: UploadType
        ) => {
            if (isBusy) {
                return;
            }

            const tempId = `temp-${crypto.randomUUID()}`;

            /*
             * IMAGE
             *
             * Create a local blob URL.
             * This is what makes the image appear immediately.
             */
            const localUrl =
                type === "chat-image"
                    ? URL.createObjectURL(selectedFile)
                    : null;

            const optimisticMessage: OptimisticMessage = {
                tempId,
                senderId: userId,
                text: null,
                image: localUrl,
                file: null,
                fileName:
                    type === "chat-file"
                        ? selectedFile.name
                        : null,
                fileType:
                    type === "chat-file"
                        ? selectedFile.type
                        : null,
                createdAt: new Date().toISOString(),
                status: "sending",
            };

            /*
             * IMPORTANT:
             * Show the message BEFORE uploading.
             */
            startTransition(() => {
                onOptimisticMessage(optimisticMessage);
            });

            try {
                /*
                 * Upload happens after optimistic UI update.
                 */
                const uploaded = await upload({
                    file: selectedFile,
                    type,
                });

                /*
                 * Now send the REAL uploaded URL to the backend.
                 */
                const result =
                    type === "chat-image"
                        ? await createChatAndMessage(
                              userId,
                              receiverId,
                              undefined,
                              uploaded.url
                          )
                        : await createChatAndMessage(
                              userId,
                              receiverId,
                              undefined,
                              undefined,
                              uploaded.url,
                              selectedFile.name,
                              selectedFile.type
                          );

                if (result?.error === "LIMIT_REACHED") {
                    onOptimisticError(tempId);
                    return;
                }

                if (!result?.success) {
                    throw new Error("Failed to create message");
                }
            } catch (error) {
                console.error(
                    "[CHAT_UPLOAD_SEND]",
                    error
                );

                onOptimisticError(tempId);
            } finally {
                /*
                 * Blob URL is no longer needed after the
                 * optimistic message has been replaced/reloaded.
                 */
                if (localUrl) {
                    URL.revokeObjectURL(localUrl);
                }
            }
        },
        [
            isBusy,
            userId,
            receiverId,
            upload,
            onOptimisticMessage,
            onOptimisticError,
        ]
    );

    /*
     * ------------------------------------------------------------
     * IMAGE
     * ------------------------------------------------------------
     */
    const handleImageUpload = useCallback(
        async (
            e: React.ChangeEvent<HTMLInputElement>
        ) => {
            const file = e.target.files?.[0];

            if (!file) {
                return;
            }

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

    /*
     * ------------------------------------------------------------
     * FILE
     * ------------------------------------------------------------
     */
    const handleFileUpload = useCallback(
        async (
            e: React.ChangeEvent<HTMLInputElement>
        ) => {
            const file = e.target.files?.[0];

            if (!file) {
                return;
            }

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

    /*
     * ------------------------------------------------------------
     * ENTER
     * ------------------------------------------------------------
     */
    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter") {
                e.preventDefault();
                sendText();
            }
        },
        [sendText]
    );

    return (
        <div className="flex flex-shrink-0 items-center gap-2 border-t border-slate-200 bg-white px-3 py-3">

            {/* File */}
            <button
                type="button"
                aria-label="Attach file"
                disabled={isBusy}
                onClick={() =>
                    fileInputRef.current?.click()
                }
                className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-100 disabled:pointer-events-none disabled:opacity-50"
            >
                <Paperclip
                    className="h-4 w-4"
                    strokeWidth={2}
                />
            </button>

            <input
                ref={fileInputRef}
                type="file"
                hidden
                disabled={isBusy}
                accept=".pdf,.doc,.docx,.zip"
                onChange={handleFileUpload}
            />

            {/* Image */}
            <button
                type="button"
                aria-label="Upload image"
                disabled={isBusy}
                onClick={() =>
                    imageInputRef.current?.click()
                }
                className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-100 disabled:pointer-events-none disabled:opacity-50"
            >
                <ImageIcon
                    className="h-4 w-4"
                    strokeWidth={2}
                />
            </button>

            <input
                ref={imageInputRef}
                type="file"
                hidden
                disabled={isBusy}
                accept="image/png,image/jpeg,image/webp,image/gif"
                onChange={handleImageUpload}
            />

            {/* Text */}
            <input
                type="text"
                value={messageText}
                onChange={(e) =>
                    setMessageText(e.target.value)
                }
                onKeyDown={handleKeyDown}
                disabled={isBusy}
                placeholder="Type a message..."
                className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm outline-none transition placeholder:text-slate-400 focus:border-[var(--primary-clr)] focus:bg-white"
            />

            {/* Send */}
            <button
                type="button"
                aria-label="Send message"
                onClick={sendText}
                disabled={
                    isBusy ||
                    messageText.trim().length === 0
                }
                className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[var(--primary-clr)] text-white transition hover:bg-[var(--primary-hover-clr)] disabled:cursor-not-allowed disabled:opacity-50"
            >
                {isBusy ? (
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
};