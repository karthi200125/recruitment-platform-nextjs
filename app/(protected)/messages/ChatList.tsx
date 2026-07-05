'use client'

import { format } from "date-fns";
import Image from "next/image";

import noProfile from "@/public/noProfile.webp";
import { ChatUser } from "@/actions/message/get-chat-users";

interface ChatListProps {
    chatUser: ChatUser;
    selectedChatUserId?: number | null;
}

export const ChatList = ({
    chatUser,
    selectedChatUserId,
}: ChatListProps) => {
    const isSelected = chatUser.id === selectedChatUserId;
    const timeAgo = format(chatUser.updatedAt, "dd MMM yyyy");
    const hasUnread = !chatUser.isSeen;

    return (
        <div
            className={`flex items-center gap-3 px-4 py-3 border-l-[3px] transition-all duration-200 ${isSelected
                ? "bg-indigo-50 border-l-indigo-500"
                : "border-l-transparent hover:bg-slate-50"
                }`}
        >
            <div className="relative flex-shrink-0">
                <div className="w-11 h-11 rounded-full overflow-hidden border border-slate-200 bg-slate-100">
                    <Image
                        src={chatUser.userImage || noProfile.src}
                        alt={chatUser.username}
                        width={44}
                        height={44}
                        className="h-full w-full object-cover"
                    />
                </div>

                {hasUnread && (
                    <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-indigo-600" />
                )}
            </div>

            <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                    <p
                        className={`truncate text-sm capitalize ${isSelected
                            ? "font-bold text-indigo-900"
                            : "font-semibold text-slate-800"
                            }`}
                    >
                        {chatUser.username}
                    </p>

                    <span className="flex-shrink-0 text-[11px] text-slate-400">
                        {timeAgo}
                    </span>
                </div>

                <p
                    className={`mt-0.5 line-clamp-1 text-xs capitalize ${hasUnread
                        ? "font-semibold text-slate-700"
                        : "text-slate-400"
                        }`}
                >
                    {chatUser.lastMessage || "No messages yet"}
                </p>
            </div>

            {hasUnread && (
                <span className="h-2 w-2 flex-shrink-0 rounded-full bg-indigo-600" />
            )}
        </div>
    );
};