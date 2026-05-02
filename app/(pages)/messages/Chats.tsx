'use client'

import Image from "next/image";
import { Fragment, useEffect, useRef } from "react";
import moment from "moment";
import noProfile from "@/public/noProfile.webp";
import noImage from "@/public/noImage.webp";

interface Sender { id: number; userImage?: string | null; }
export interface ChatMessage {
    id: number; senderId: number;
    text?: string | null; image?: string | null;
    createdAt: string | Date; sender?: Sender;
}
interface CurrentUser { id: number; userImage?: string | null; }
interface ChatsProps {
    messages: ChatMessage[]; currentUserId?: number;
    user?: CurrentUser | null; isChatuser?: boolean;
}

export const Chats = ({ messages, currentUserId, user, isChatuser = false }: ChatsProps) => {
    const endRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages.length]);
    let lastDate = "";

    return (
        <div className={`w-full overflow-y-auto px-4 py-4 flex flex-col gap-4 ${!isChatuser ? "h-[400px] mb-[72px]" : "flex-1"}`}>
            {messages.map((msg) => {
                const messageDate = moment(msg.createdAt).format("MMMM D, YYYY");
                const showDateSeparator = messageDate !== lastDate;
                lastDate = messageDate;
                const isMe = msg.senderId === currentUserId;

                return (
                    <Fragment key={msg.id}>
                        {showDateSeparator && (
                            <div className="flex items-center gap-3 my-1">
                                <div className="flex-1 h-px bg-slate-100" />
                                <span className="text-[11px] font-semibold text-slate-400 bg-slate-50 border border-slate-200 rounded-full px-3 py-0.5 flex-shrink-0">
                                    {messageDate}
                                </span>
                                <div className="flex-1 h-px bg-slate-100" />
                            </div>
                        )}

                        <div className={`flex items-end gap-2 max-w-[80%] sm:max-w-[72%] ${isMe ? "self-end flex-row-reverse" : "self-start"}`}>
                            {/* Avatar */}
                            <div className="w-7 h-7 rounded-full overflow-hidden border border-slate-200 flex-shrink-0 bg-slate-100">
                                <Image
                                    src={(isMe ? user?.userImage : msg.sender?.userImage) || noProfile}
                                    alt="avatar"
                                    width={28} height={28}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Bubble */}
                            <div className="space-y-1">
                                {msg.image && (
                                    <div className="relative overflow-hidden rounded-2xl w-[200px] sm:w-[280px] h-[140px] sm:h-[200px] border border-slate-200">
                                        <Image src={msg.image || noImage} alt="image" fill className="object-cover" />
                                    </div>
                                )}
                                {msg.text && (
                                    <p className={`px-3.5 py-2 rounded-2xl text-sm break-words leading-relaxed ${isMe ? "rounded-br-sm bg-indigo-600 text-white" : "rounded-bl-sm bg-slate-100 text-slate-800"}`}>
                                        {msg.text}
                                    </p>
                                )}
                                <p className={`text-[10px] text-slate-400 px-1 ${isMe ? "text-right" : "text-left"}`}>
                                    {moment(msg.createdAt).format("h:mm A")}
                                </p>
                            </div>
                        </div>
                    </Fragment>
                );
            })}
            <div ref={endRef} />
        </div>
    );
};
