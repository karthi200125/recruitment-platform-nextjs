import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { SendHorizonal, ImageIcon, Paperclip, Loader2, Crown } from "lucide-react";
import { createChatAndMessage } from "@/actions/message/createChatAndMessage ";
import Link from "next/link";

interface ChatButtonProps { userId: number; receiverId: number; }

export const ChatButton = ({ userId, receiverId }: ChatButtonProps) => {
    const [messageText, setMessageText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [limitReached, setLimitReached] = useState(false);
    const queryClient = useQueryClient();

    const handleSend = async () => {
        const trimmed = messageText.trim();
        if (!trimmed || isLoading) return;

        const optimisticMessage = {
            id: Date.now(), senderId: userId, text: trimmed,
            image: null, isSeen: false, createdAt: new Date().toISOString(),
        };

        queryClient.setQueryData(["conversation", userId, receiverId], (old: any) => {
            if (!old) return old;
            return { ...old, messages: [...old.messages, optimisticMessage] };
        });

        setMessageText("");
        try {
            setIsLoading(true);
            const result = await createChatAndMessage(userId, receiverId, trimmed);
            if (result?.error === "LIMIT_REACHED") { setLimitReached(true); return; }
            if (result?.success) {
                queryClient.invalidateQueries({ queryKey: ["conversation", userId, receiverId] });
                queryClient.invalidateQueries({ queryKey: ["chatUsers", userId] });
            }
        } catch (err) { console.error("[ChatButton]", err); }
        finally { setIsLoading(false); }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") { e.preventDefault(); handleSend(); }
    };

    if (limitReached) {
        return (
            <div className="flex-shrink-0 flex items-center justify-between gap-3 px-4 py-3 border-t border-slate-100 bg-amber-50">
                <div className="flex items-center gap-2">
                    <Crown className="w-4 h-4 text-amber-500 flex-shrink-0" strokeWidth={2} />
                    <p className="text-xs text-amber-700 font-medium">Free message limit reached.</p>
                </div>
                <Link href="/subscription" className="text-xs font-bold text-amber-700 underline underline-offset-2 hover:text-amber-800 flex-shrink-0">
                    Upgrade
                </Link>
            </div>
        );
    }

    return (
        <div className="flex-shrink-0 flex items-center gap-2 px-3 py-3 border-t border-slate-100 bg-white">
            <label htmlFor="chat-file" className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 cursor-pointer transition-colors duration-200">
                <Paperclip className="w-4 h-4" strokeWidth={1.75} />
            </label>
            <input id="chat-file" type="file" className="hidden" />

            <label htmlFor="chat-image" className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 cursor-pointer transition-colors duration-200">
                <ImageIcon className="w-4 h-4" strokeWidth={1.75} />
            </label>
            <input id="chat-image" type="file" accept="image/*" className="hidden" />

            <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/30 transition-all duration-200"
            />

            <button
                onClick={handleSend}
                disabled={!messageText.trim() || isLoading}
                className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 flex-shrink-0 shadow-sm shadow-indigo-200"
            >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <SendHorizonal className="w-4 h-4" strokeWidth={2} />}
            </button>
        </div>
    );
};
