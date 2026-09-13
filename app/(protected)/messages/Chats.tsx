"use client";

import { format } from "date-fns";
import Image from "next/image";
import { Fragment, memo, useEffect, useMemo, useRef } from "react";

import noImage from "@/public/noImage.webp";
import noProfile from "@/public/noProfile.webp";
import type { ChatMessage } from "@/types/chat";
import { Loader2 } from "lucide-react";
import type { OptimisticMessage } from "./ChatButton";

interface CurrentUser {
  id: number;
  profileImage?: string | null;
}

interface ChatsProps {
  messages: ChatMessage[];
  currentUserId?: number;
  user?: CurrentUser | null;
  isChatuser?: boolean;
  optimisticMessages?: OptimisticMessage[];
}

type DisplayMessage =
  | ChatMessage
  | OptimisticMessage;

const isOptimisticMessage = (
  message: DisplayMessage
): message is OptimisticMessage => {
  return "tempId" in message;
};

const Chats = ({
  messages,
  currentUserId,
  user,
  isChatuser = false,
  optimisticMessages = [],
}: ChatsProps) => {
  const endRef =
    useRef<HTMLDivElement | null>(null);

  /*
   * Merge database messages + optimistic messages.
   *
   * Optimistic messages are kept until the real DB message
   * arrives.
   */
  const allMessages = useMemo(() => {
    const optimistic = optimisticMessages.filter(
      (optimistic) =>
        !messages.some(
          (message) =>
            message.senderId ===
            optimistic.senderId &&
            message.text ===
            optimistic.text &&
            message.image &&
            optimistic.image &&
            optimistic.status ===
            "sending"
        )
    );

    return [
      ...messages,
      ...optimistic,
    ].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() -
        new Date(b.createdAt).getTime()
    );
  }, [
    messages,
    optimisticMessages,
  ]);

  /*
   * Scroll to newest message.
   */
  useEffect(() => {
    endRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [allMessages.length]);

  let lastDate = "";

  return (
    <div
      className={`flex w-full flex-col gap-4 overflow-y-auto px-4 py-4 ${!isChatuser
        ? "mb-[72px] h-[400px]"
        : "flex-1"
        }`}
    >
      {allMessages.map((msg) => {
        const createdAt =
          new Date(msg.createdAt);

        const messageDate = format(
          createdAt,
          "dd MMM yyyy"
        );

        const showDateSeparator =
          messageDate !== lastDate;

        lastDate = messageDate;

        const isMe =
          msg.senderId === currentUserId;

        const avatar =
          isMe
            ? user?.profileImage ||
            noProfile
            : isOptimisticMessage(msg)
              ? noProfile
              : msg.sender
                ?.profileImage ||
              noProfile;

        const isOptimistic =
          isOptimisticMessage(msg);

        const isSending =
          isOptimistic &&
          msg.status === "sending";

        const isError =
          isOptimistic &&
          msg.status === "error";

        return (
          <Fragment
            key={
              isOptimistic
                ? msg.tempId
                : msg.id
            }
          >
            {/* DATE */}
            {showDateSeparator && (
              <div className="my-1 flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-100" />

                <span className="flex-shrink-0 rounded-full border border-slate-200 bg-slate-50 px-3 py-0.5 text-[11px] font-semibold text-slate-400">
                  {messageDate}
                </span>

                <div className="h-px flex-1 bg-slate-100" />

              </div>
            )}

            {/* MESSAGE */}
            <div
              className={`flex max-w-[80%] items-end gap-2 sm:max-w-[72%] ${isMe
                ? "self-end flex-row-reverse"
                : "self-start"
                }`}
            >
              {/* AVATAR */}
              <div className="h-7 w-7 flex-shrink-0 overflow-hidden rounded-full border border-slate-200 bg-slate-100">
                <Image
                  src={avatar}
                  alt="avatar"
                  width={28}
                  height={28}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* CONTENT */}
              <div className="space-y-1">

                {/* IMAGE */}
                {msg.image && (
                  <div
                    className={`relative h-[140px] w-[200px] overflow-hidden rounded-2xl border border-slate-200 sm:h-[200px] sm:w-[280px] ${isSending
                      ? "opacity-70"
                      : ""
                      }`}
                  >
                    <Image
                      src={
                        msg.image ||
                        noImage
                      }
                      alt="image"
                      fill
                      sizes="(max-width: 640px) 200px, 280px"
                      className="object-cover"
                      unoptimized={
                        isOptimistic
                      }
                    />

                    {isSending && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <Loader2 className="h-5 w-5 animate-spin text-white" />
                      </div>
                    )}
                  </div>
                )}

                {/* FILE */}
                {msg.file ? (
                  <a
                    href={msg.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-3 break-all rounded-2xl border px-4 py-3 transition-all ${isMe
                      ? "border-indigo-500 bg-indigo-600 text-white"
                      : "border-slate-200 bg-white text-slate-800"
                      }`}
                  >
                    <div className="text-xl">
                      📎
                    </div>

                    <div className="flex flex-col">
                      <span className="text-sm font-medium">
                        {msg.fileName ||
                          "Attachment"}
                      </span>

                      {msg.fileType && (
                        <span
                          className={`text-xs ${isMe
                            ? "text-indigo-100"
                            : "text-slate-500"
                            }`}
                        >
                          {
                            msg.fileType
                          }
                        </span>
                      )}
                    </div>
                  </a>
                ) : (
                  isOptimistic &&
                  msg.fileName && (
                    <div
                      className={`flex items-center gap-3 break-all rounded-2xl border px-4 py-3 ${isMe
                        ? "border-indigo-500 bg-indigo-600 text-white"
                        : "border-slate-200 bg-white text-slate-800"
                        }`}
                    >
                      <div className="text-xl">
                        📎
                      </div>

                      <div className="flex min-w-0 flex-col">
                        <span className="truncate text-sm font-medium">
                          {
                            msg.fileName
                          }
                        </span>

                        {msg.fileType && (
                          <span className="text-xs text-indigo-100">
                            {
                              msg.fileType
                            }
                          </span>
                        )}
                      </div>

                      {isSending && (
                        <Loader2 className="h-4 w-4 flex-shrink-0 animate-spin" />
                      )}
                    </div>
                  )
                )}

                {/* TEXT */}
                {msg.text && (
                  <p
                    className={`break-words whitespace-pre-wrap rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${isMe
                      ? "rounded-br-sm bg-indigo-600 text-white"
                      : "rounded-bl-sm bg-slate-100 text-slate-800"
                      } ${isSending
                        ? "opacity-70"
                        : ""
                      } ${isError
                        ? "bg-red-500"
                        : ""
                      }`}
                  >
                    {msg.text}
                  </p>
                )}

                {/* TIME / STATUS */}
                <p
                  className={`px-1 text-[10px] text-slate-400 ${isMe
                    ? "text-right"
                    : "text-left"
                    }`}
                >
                  {isSending
                    ? "Sending..."
                    : isError
                      ? "Failed"
                      : format(
                        createdAt,
                        "hh:mm a"
                      )}
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

Chats.displayName = "Chats";

export { Chats };
export default memo(Chats);