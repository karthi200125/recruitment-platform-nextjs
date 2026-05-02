'use client'

import Image from "next/image";
import moment from "moment";
import noProfile from "@/public/noProfile.webp";

interface ChatListProps {
    chatUser?: any;
    selectedChatUserId?: number | null;
}

export const ChatList = ({ chatUser, selectedChatUserId }: ChatListProps) => {
    const isSelected = chatUser?.id === selectedChatUserId;
    const timeAgo = moment(chatUser?.updatedAt).format("MMM D");
    const hasUnread = chatUser?.isSeen === false;

    return (
        <div className={`flex items-center gap-3 px-4 py-3 border-l-[3px] transition-all duration-200 ${isSelected
                ? "bg-indigo-50 border-l-indigo-500"
                : "border-l-transparent hover:bg-slate-50"
            }`}>
            {/* Avatar */}
            <div className="relative flex-shrink-0">
                <div className="w-11 h-11 rounded-full overflow-hidden border border-slate-200 bg-slate-100">
                    <Image
                        src={chatUser?.userImage || noProfile.src}
                        alt={chatUser?.username || "User"}
                        width={44} height={44}
                        className="w-full h-full object-cover"
                    />
                </div>
                {hasUnread && (
                    <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-indigo-600 border-2 border-white" />
                )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                    <p className={`text-sm capitalize truncate ${isSelected ? "font-bold text-indigo-900" : "font-semibold text-slate-800"}`}>
                        {chatUser?.username}
                    </p>
                    <span className="text-[11px] text-slate-400 flex-shrink-0">{timeAgo}</span>
                </div>
                <p className={`text-xs capitalize line-clamp-1 mt-0.5 ${hasUnread ? "font-semibold text-slate-700" : "text-slate-400"}`}>
                    {chatUser?.lastMessage || "No messages yet"}
                </p>
            </div>

            {/* Unread dot */}
            {hasUnread && (
                <span className="w-2 h-2 rounded-full bg-indigo-600 flex-shrink-0" />
            )}
        </div>
    );
};

