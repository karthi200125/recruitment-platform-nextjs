"use client";

import Image from "next/image";
import { Fragment, useEffect, useRef } from "react";
import { format } from "date-fns";

import noProfile from "@/public/noProfile.webp";
import noImage from "@/public/noImage.webp";
import { ChatMessage } from "@/types/chat";

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

export const Chats = ({
  messages,
  currentUserId,
  user,
  isChatuser = false,
}: ChatsProps) => {
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages.length]);

  let lastDate = "";

  return (
    <div
      className={`w-full overflow-y-auto px-4 py-4 flex flex-col gap-4 ${
        !isChatuser
          ? "h-[400px] mb-[72px]"
          : "flex-1"
      }`}
    >
      {messages.map((msg) => {
        const messageDate = format(new Date(msg.createdAt), "dd MMM yyyy");

        const showDateSeparator =
          messageDate !== lastDate;

        lastDate = messageDate;

        const isMe =
          msg.senderId === currentUserId;

        return (
          <Fragment key={msg.id}>
            {/* DATE */}
            {showDateSeparator && (
              <div className="flex items-center gap-3 my-1">
                <div className="flex-1 h-px bg-slate-100" />

                <span className="text-[11px] font-semibold text-slate-400 bg-slate-50 border border-slate-200 rounded-full px-3 py-0.5 flex-shrink-0">
                  {messageDate}
                </span>

                <div className="flex-1 h-px bg-slate-100" />
              </div>
            )}

            {/* MESSAGE */}
            <div
              className={`flex items-end gap-2 max-w-[80%] sm:max-w-[72%]
              ${
                isMe
                  ? "self-end flex-row-reverse"
                  : "self-start"
              }`}
            >
              {/* AVATAR */}
              <div className="w-7 h-7 rounded-full overflow-hidden border border-slate-200 flex-shrink-0 bg-slate-100">
                <Image
                  src={
                    (isMe
                      ? user?.userImage
                      : msg.sender?.userImage) ||
                    noProfile
                  }
                  alt="avatar"
                  width={28}
                  height={28}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* CONTENT */}
              <div className="space-y-1">

                {/* IMAGE */}
                {msg.image && (
                  <div className="relative overflow-hidden rounded-2xl w-[200px] sm:w-[280px] h-[140px] sm:h-[200px] border border-slate-200">
                    <Image
                      src={msg.image || noImage}
                      alt="image"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                {/* FILE */}
                {msg.file && (
                  <a
                    href={msg.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all duration-200 break-all
                    ${
                      isMe
                        ? "bg-indigo-600 border-indigo-500 text-white"
                        : "bg-white border-slate-200 text-slate-800"
                    }`}
                  >
                    {/* ICON */}
                    <div className="text-xl">
                      📎
                    </div>

                    {/* INFO */}
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">
                        {msg.fileName ||
                          "Attachment"}
                      </span>

                      {msg.fileType && (
                        <span
                          className={`text-xs
                          ${
                            isMe
                              ? "text-indigo-100"
                              : "text-slate-500"
                          }`}
                        >
                          {msg.fileType}
                        </span>
                      )}
                    </div>
                  </a>
                )}

                {/* TEXT */}
                {msg.text && (
                  <p
                    className={`px-3.5 py-2 rounded-2xl text-sm break-words leading-relaxed
                    ${
                      isMe
                        ? "rounded-br-sm bg-indigo-600 text-white"
                        : "rounded-bl-sm bg-slate-100 text-slate-800"
                    }`}
                  >
                    {msg.text}
                  </p>
                )}

                {/* TIME */}
                <p
                  className={`text-[10px] text-slate-400 px-1
                  ${
                    isMe
                      ? "text-right"
                      : "text-left"
                  }`}
                >                  
                  {format(new Date(msg.createdAt), "hh:mm a")}
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