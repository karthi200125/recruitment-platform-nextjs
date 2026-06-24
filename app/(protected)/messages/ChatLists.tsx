"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { MessageSquare } from "lucide-react";
import BottomDrawer from "@/components/BottomDrawer";
import { MessageBox } from "./MessageBox";
import { ChatList } from "./ChatList";

export interface ChatUser {
  id: number; username: string;
  userImage?: string | null; profession?: string | null;
  lastMessage?: string | null;
}

interface ChatListsProps {
  chatUsers: ChatUser[]; isPending?: boolean;
  onSelectedChatUserId?: (id: number) => void;
  defaultChatUserId?: number | null;
}

function ChatListSkeleton() {
  return (
    <div className="divide-y divide-slate-100">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 px-4 py-3 animate-pulse">
          <div className="w-11 h-11 rounded-full bg-slate-200 flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-3.5 w-2/3 rounded-lg bg-slate-200" />
            <div className="h-3 w-4/5 rounded-lg bg-slate-100" />
          </div>
        </div>
      ))}
    </div>
  );
}

export const ChatLists = ({ chatUsers, isPending = false, onSelectedChatUserId, defaultChatUserId }: ChatListsProps) => {
  const [selectedId, setSelectedId] = useState<number | null>(defaultChatUserId ?? null);

  useEffect(() => {
    if (defaultChatUserId != null) setSelectedId(defaultChatUserId);
  }, [defaultChatUserId]);

  const handleSelect = useCallback((id: number) => {
    setSelectedId(id);
    onSelectedChatUserId?.(id);
  }, [onSelectedChatUserId]);

  if (isPending) return <ChatListSkeleton />;

  if (!chatUsers.length) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16 text-center px-4">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center">
          <MessageSquare className="w-5 h-5 text-slate-400" strokeWidth={1.75} />
        </div>
        <p className="text-sm font-medium text-slate-500">No conversations yet</p>
        <p className="text-xs text-slate-400">Start a conversation from a user's profile.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
      {chatUsers.map((chatUser) => {
        const isSelected = selectedId === chatUser.id;
        const row = <ChatList chatUser={chatUser} selectedChatUserId={selectedId} />;

        return (
          <div
            key={chatUser.id}
            onClick={() => handleSelect(chatUser.id)}
            className="cursor-pointer"
          >
            {/* Mobile → bottom drawer */}
            <div className="md:hidden">
              <BottomDrawer
                body={<MessageBox receiverId={chatUser.id} chatUser={chatUser} isLoading={isPending} isChatuser />}
              >
                {row}
              </BottomDrawer>
            </div>
            {/* Desktop */}
            <div className="hidden md:block">{row}</div>
          </div>
        );
      })}
    </div>
  );
};
