
"use client";

import Image from "next/image";
import { Fragment, useEffect, useRef } from "react";
import moment from "moment";

import noProfile from "@/public/noProfile.webp";
import noImage from "@/public/noImage.webp";

/* ────────────────────────────────────────────────
   Types
──────────────────────────────────────────────── */
interface Sender {
    id: number;
    userImage?: string | null;
}

interface ChatMessage {
    id: number;
    senderId: number;
    text?: string | null;
    image?: string | null;
    createdAt: string | Date;
    sender?: Sender;
}

interface CurrentUser {
    id: number;
    userImage?: string | null;
}


interface ChatsProps {
    messages: ChatMessage[];
    currentUserId?: number;
    user?: CurrentUser | null;
    isChatuser?: boolean;
}



/* ────────────────────────────────────────────────
   Component
──────────────────────────────────────────────── */
const Chats = ({
    messages,
    currentUserId,
    user,
    isChatuser = false,
}: ChatsProps) => {
    const endRef = useRef<HTMLDivElement | null>(null);

    /* ────────────────────────────────────────────────
       Auto Scroll To Latest Message
    ──────────────────────────────────────────────── */
    useEffect(() => {
        endRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, [messages]);

    let lastDate = "";

    return (
        <div
            className={`
        w-full overflow-y-auto p-3 flex flex-col gap-8
        ${!isChatuser ? "h-[400px] mb-[80px]" : "chatsh"}
      `}
        >
            {messages.map((msg) => {
                const messageDate = moment(msg.createdAt).format(
                    "MMMM D, YYYY"
                );

                const showDateSeparator = messageDate !== lastDate;
                lastDate = messageDate;

                const isCurrentUser = msg.senderId === currentUserId;

                return (
                    <Fragment key={msg.id}>
                        {/* Date Separator */}
                        {showDateSeparator && (
                            <div className="text-center text-xs md:text-sm font-semibold text-neutral-500">
                                {messageDate}
                            </div>
                        )}

                        {/* Message Row */}
                        <div
                            className={`
                max-w-[85%] sm:max-w-[75%] lg:max-w-[70%]
                flex gap-2
                ${isCurrentUser ? "self-end" : "self-start"}
              `}
                        >
                            <div className="relative space-y-2">
                                {/* Image Message */}
                                {msg.image && (
                                    <div
                                        className="
                      relative overflow-hidden rounded-lg
                      w-[220px] sm:w-[300px] md:w-[450px]
                      h-[150px] sm:h-[220px] md:h-[280px]
                    "
                                    >
                                        <Image
                                            src={msg.image || noImage}
                                            alt="Sent image"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                )}

                                {/* Text Bubble + Avatar */}
                                <div
                                    className={`
                    flex items-end gap-2
                    ${isCurrentUser
                                            ? "flex-row"
                                            : "flex-row-reverse"
                                        }
                  `}
                                >
                                    {msg.text && (
                                        <p
                                            className={`
                        px-3 py-2 rounded-lg text-sm md:text-base break-words
                        max-w-[250px] sm:max-w-[350px] md:max-w-[450px]
                        ${isCurrentUser
                                                    ? "bg-[var(--voilet)] text-white"
                                                    : "bg-neutral-100 text-black"
                                                }
                      `}
                                        >
                                            {msg.text}
                                        </p>
                                    )}

                                    <Image
                                        src={
                                            (isCurrentUser
                                                ? user?.userImage
                                                : msg.sender?.userImage) || noProfile
                                        }
                                        alt="User avatar"
                                        width={35}
                                        height={35}
                                        className="rounded-full object-cover shrink-0"
                                    />
                                </div>

                                {/* Time */}
                                <span
                                    className={`
                    absolute bottom-[-20px] text-xs text-neutral-500
                    ${isCurrentUser
                                            ? "left-0"
                                            : "left-[43px]"
                                        }
                  `}
                                >
                                    {moment(msg.createdAt).format("h:mm A")}
                                </span>
                            </div>
                        </div>
                    </Fragment>
                );
            })}

            <div ref={endRef} />
        </div>
    );
};

export default Chats;

