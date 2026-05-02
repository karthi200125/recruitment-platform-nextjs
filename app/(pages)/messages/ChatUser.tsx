'use client'

import { MoreHorizontal, Circle } from "lucide-react";
import Image from "next/image";

interface ChatUserType { id: number; username?: string; userImage?: string | null; }
interface ChatUserProps { chatUser?: ChatUserType | null; isChatuser?: boolean; }

export const ChatUser = ({ chatUser, isChatuser }: ChatUserProps) => {
    if (!isChatuser || !chatUser) return null;
    return (
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-white flex-shrink-0">
            <div className="flex items-center gap-3">
                <div className="relative">
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 bg-slate-100">
                        <Image
                            src={chatUser.userImage || '/noProfile.webp'}
                            alt={chatUser.username || "User"}
                            width={40} height={40}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <Circle className="absolute bottom-0 right-0 w-3 h-3 text-emerald-500 fill-emerald-500 border border-white rounded-full" strokeWidth={0} />
                </div>
                <div>
                    <p className="text-sm font-bold text-slate-800 capitalize">{chatUser.username || "Unknown User"}</p>
                    <p className="text-xs text-slate-400">Active now</p>
                </div>
            </div>
            <button aria-label="More" className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors duration-200">
                <MoreHorizontal className="w-4 h-4" />
            </button>
        </div>
    );
};

