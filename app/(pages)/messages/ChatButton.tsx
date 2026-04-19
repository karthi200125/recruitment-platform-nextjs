
"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";


import Button from "@/components/Button";

import { CiImageOn } from "react-icons/ci";
import { IoMdSend } from "react-icons/io";
import { MdAttachFile } from "react-icons/md";
import { createChatAndMessage } from "@/actions/message/createChatAndMessage ";

/* ────────────────────────────────────────────────
   Types
──────────────────────────────────────────────── */
interface ChatButtonProps {
    userId: number;
    receiverId: number;
}

/* ────────────────────────────────────────────────
   Component
──────────────────────────────────────────────── */
const ChatButton = ({
    userId,
    receiverId,
}: ChatButtonProps) => {
    const [messageText, setMessageText] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const queryClient = useQueryClient();

    /* ────────────────────────────────────────────────
       Send Message Handler
    ──────────────────────────────────────────────── */
    const handleSend = async () => {
        const trimmedMessage = messageText.trim();

        if (!trimmedMessage || isLoading) return;

        try {
            setIsLoading(true);

            const result = await createChatAndMessage(
                userId,
                receiverId,
                trimmedMessage
            );

            if (result?.success) {
                queryClient.invalidateQueries({
                    queryKey: ["getChatUsers", userId],
                });

                queryClient.invalidateQueries({
                    queryKey: ["getConversation", userId, receiverId],
                });

                setMessageText("");
            }
        } catch (error) {
            console.error(
                "[ChatButton] Failed to send message:",
                error
            );
        } finally {
            setIsLoading(false);
        }
    };

    /* ────────────────────────────────────────────────
       Keyboard Support
    ──────────────────────────────────────────────── */
    const handleKeyDown = (
        e: React.KeyboardEvent<HTMLInputElement>
    ) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div
            className="
        absolute bottom-0 left-0 w-full
        flex items-center gap-2 md:gap-4
        px-3 py-3
        border-t border-neutral-200
        bg-white z-10
      "
        >
            {/* Hidden File Inputs */}
            <input
                id="chat-file-select"
                type="file"
                hidden
                accept="*/*"
            />

            <input
                id="chat-image-select"
                type="file"
                hidden
                accept="image/*"
            />

            {/* Attach File */}
            <label
                htmlFor="chat-file-select"
                className="cursor-pointer hover:opacity-60 transition"
                aria-label="Attach file"
            >
                <MdAttachFile size={24} />
            </label>

            {/* Attach Image */}
            <label
                htmlFor="chat-image-select"
                className="cursor-pointer hover:opacity-60 transition"
                aria-label="Attach image"
            >
                <CiImageOn size={24} />
            </label>

            {/* Message Input */}
            <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                className="
          flex-1
          bg-neutral-100
          px-3 py-2
          rounded-md
          text-sm md:text-base
          outline-none
          focus:ring-2 focus:ring-[var(--voilet)]
        "
            />

            {/* Send Button */}
            <Button
                isLoading={isLoading}
                onClick={handleSend}
                disabled={!messageText.trim()}
                className="flex items-center gap-2 shrink-0"
            >
                <span className="hidden md:block">Send</span>
                <IoMdSend size={18} />
            </Button>
        </div>
    );
};

export default ChatButton;

