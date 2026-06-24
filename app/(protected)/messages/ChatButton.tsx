"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import {
    SendHorizonal,
    ImageIcon,
    Paperclip,
    Loader2,
    Crown,
} from "lucide-react";

import Link from "next/link";

import { useFileUpload } from "@/hooks/useFileUpload";
import { createChatAndMessage } from "@/actions/message/create-chat-message ";


interface ChatButtonProps {
    userId: number;
    receiverId: number;
}

export const ChatButton = ({
    userId,
    receiverId,
}: ChatButtonProps) => {
    const [messageText, setMessageText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [limitReached, setLimitReached] = useState(false);

    const queryClient = useQueryClient();

    const { upload, loading: uploadLoading } =
        useFileUpload();

    /* ================= SEND ================= */
    const handleSend = async (
        image?: string,
        file?: string,
        fileName?: string,
        fileType?: string
    ) => {
        const trimmed = messageText.trim();

        // ✅ must contain something
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

                queryClient.invalidateQueries({
                    queryKey: [
                        "conversation",
                        userId,
                        receiverId,
                    ],
                });

                queryClient.invalidateQueries({
                    queryKey: ["chatUsers", userId],
                });
            }
        } catch (err) {
            console.error("[ChatButton]", err);
        } finally {
            setIsLoading(false);
        }
    };

    /* ================= IMAGE ================= */
    const handleImageUpload = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const selectedFile = e.target.files?.[0];

        if (!selectedFile) return;

        try {
            const res = await upload({
                file: selectedFile,
                type: "chatImage",
            });

            await handleSend(res.url);
        } catch (err) {
            console.error("[ImageUpload]", err);
        }
    };

    /* ================= FILE ================= */
    const handleFileUpload = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const selectedFile = e.target.files?.[0];

        if (!selectedFile) return;

        try {
            const res = await upload({
                file: selectedFile,
                type: "chatFile",
            });

            await handleSend(
                undefined,
                res.url,
                selectedFile.name,
                selectedFile.type
            );
        } catch (err) {
            console.error("[FileUpload]", err);
        }
    };

    /* ================= ENTER ================= */
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
            <div className="flex-shrink-0 flex items-center justify-between gap-3 px-4 py-3 border-t border-slate-100 bg-amber-50">
                <div className="flex items-center gap-2">
                    <Crown
                        className="w-4 h-4 text-amber-500"
                        strokeWidth={2}
                    />

                    <p className="text-xs text-amber-700 font-medium">
                        Free message limit reached.
                    </p>
                </div>

                <Link
                    href="/subscription"
                    className="text-xs font-bold text-amber-700 underline underline-offset-2"
                >
                    Upgrade
                </Link>
            </div>
        );
    }

    return (
        <div className="flex-shrink-0 flex items-center gap-2 px-3 py-3 border-t border-slate-100 bg-white">

            {/* FILE */}
            <label
                htmlFor="chat-file"
                className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 cursor-pointer"
            >
                <Paperclip className="w-4 h-4" />
            </label>

            <input
                id="chat-file"
                type="file"
                className="hidden"
                onChange={handleFileUpload}
            />

            {/* IMAGE */}
            <label
                htmlFor="chat-image"
                className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 cursor-pointer"
            >
                <ImageIcon className="w-4 h-4" />
            </label>

            <input
                id="chat-image"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
            />

            {/* MESSAGE */}
            <input
                type="text"
                value={messageText}
                onChange={(e) =>
                    setMessageText(e.target.value)
                }
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm outline-none"
            />

            {/* SEND */}
            <button
                onClick={() => handleSend()}
                disabled={
                    (!messageText.trim() &&
                        !uploadLoading) ||
                    isLoading
                }
                className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white disabled:opacity-40"
            >
                {isLoading || uploadLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                    <SendHorizonal className="w-4 h-4" />
                )}
            </button>
        </div>
    );
};