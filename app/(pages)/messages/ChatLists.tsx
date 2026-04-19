"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";

import BottomDrawer from "@/components/BottomDrawer";
import ChatList from "./ChatList";
import MessageBox from "./MessageBox";
import EmployeesSkeleton from "@/Skeletons/EmployeesSkeleton";


export interface ChatUser {
  id: number;
  username: string;
  userImage?: string | null;
  profession?: string | null;
  lastMessage?: string | null;
}

interface ChatUsersProps {
  chatUsers: ChatUser[];
  isPending?: boolean;
  onSelectedChatUserId?: (id: number) => void;
  defaultChatUserId?: number | null;
  onSearch?: (query: string) => void;
}


const ChatLists = ({
  chatUsers,
  isPending = false,
  onSelectedChatUserId,
  defaultChatUserId,
  onSearch,
}: ChatUsersProps) => {
  const [selectedChatUserId, setSelectedChatUserId] = useState<number | null>(
    defaultChatUserId ?? null
  );
  const [q, setQ] = useState("");

  
  useEffect(() => {
    if (defaultChatUserId !== undefined && defaultChatUserId !== null) {
      setSelectedChatUserId(defaultChatUserId);
    }
  }, [defaultChatUserId]);

  
  const handleSelectChatUserId = useCallback(
    (chatUserId: number) => {
      setSelectedChatUserId(chatUserId);
      onSelectedChatUserId?.(chatUserId);
    },
    [onSelectedChatUserId]
  );

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setQ(value);
      onSearch?.(value); // ✅ correct (no stale value bug)
    },
    [onSearch]
  );

  
  const chatItems = useMemo(() => {
    if (isPending) {
      return <EmployeesSkeleton count={6} />;
    }

    if (!chatUsers || chatUsers.length === 0) {
      return (
        <div className="p-4 text-sm text-gray-400 text-center">
          No conversations yet
        </div>
      );
    }

    return chatUsers.map((chatUser) => {
      const isSelected = selectedChatUserId === chatUser.id;

      const content = (
        <ChatList
          chatUser={chatUser}
          selectedChatUserId={selectedChatUserId}
        />
      );

      return (
        <div
          key={chatUser.id}
          onClick={() => handleSelectChatUserId(chatUser.id)}
          className={`cursor-pointer transition-colors ${isSelected ? "bg-gray-100" : "hover:bg-gray-50"
            }`}
        >
          {/* Mobile → Drawer */}
          <div className="md:hidden">
            <BottomDrawer
              body={
                <MessageBox
                  receiverId={chatUser.id}
                  chatUser={chatUser}
                  isLoading={isPending}
                  isChatuser
                />
              }
            >
              {content}
            </BottomDrawer>
          </div>

          {/* Desktop */}
          <div className="hidden md:block">{content}</div>
        </div>
      );
    });
  }, [chatUsers, isPending, selectedChatUserId, handleSelectChatUserId]);

  
  return (
    <div className="w-full md:flex-[2] h-full flex flex-col border-neutral-200">

      {/* Header */}
      <div className="p-4 border-b space-y-3">
        <h3 className="font-semibold text-sm">Messages</h3>

        {/* Search */}
        <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg">
          <IoSearchOutline className="text-gray-500" />
          <input
            type="text"
            value={q}
            onChange={handleSearchChange}
            placeholder="Search conversations..."
            className="w-full bg-transparent text-sm outline-none"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {chatItems}
      </div>
    </div>
  );
};

export default ChatLists;