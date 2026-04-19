"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";

import ChatLists from "./ChatLists";
import MessageBox from "./MessageBox";
import { getChatUsers } from "@/actions/message/getChatUsers";


interface AuthUser {
  id: number;
}

interface RootState {
  user: { user: AuthUser | null };
}

interface ChatUser {
  id: number;
  username: string;
  userImage?: string | null;
  profession?: string | null;
  lastMessage?: string | null;
  role?: string;
}


const Messages = () => {
  const user = useSelector((state: RootState) => state.user.user);

  const [selectedChatUserId, setSelectedChatUserId] = useState<number | null>(null);
  const [q, setQ] = useState("");

  
  const {
    data: chatUsers = [],
    isPending,
    isError,
    refetch,
  } = useQuery<ChatUser[]>({
    queryKey: ["chatUsers", user?.id, q],
    queryFn: async () => {
      if (!user?.id) return [];
      return await getChatUsers(user.id, q);
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60, // 1 min cache
  });

  
  useEffect(() => {
    if (!selectedChatUserId && chatUsers.length > 0) {
      setSelectedChatUserId(chatUsers[0].id);
    }
  }, [chatUsers, selectedChatUserId]);

  
  const selectedUser = useMemo(
    () => chatUsers.find((u) => u.id === selectedChatUserId) || null,
    [chatUsers, selectedChatUserId]
  );

  
  const handleSelectChat = useCallback((id: number) => {
    setSelectedChatUserId(id);
  }, []);

  
  if (!user) {
    return (
      <div className="h-[60vh] flex items-center justify-center text-sm text-gray-500">
        Please login to view messages
      </div>
    );
  }

  if (isError) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-3 text-sm">
        <p className="text-red-500">Failed to load chats</p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 rounded-md bg-black text-white text-xs"
        >
          Retry
        </button>
      </div>
    );
  }

  
  return (
    <div className="w-full h-[calc(100vh-80px)] flex rounded-2xl border overflow-hidden bg-white shadow-sm">

      {/* ───────── LEFT: Chat List ───────── */}
      <div className="w-full md:w-[320px] border-r flex flex-col">
        
        {/* Search */}
        <div className="p-3 border-b">
          <input
            type="text"
            placeholder="Search conversations..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-full px-3 py-2 text-sm border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Chat List */}
        <ChatLists
          chatUsers={chatUsers}
          isPending={isPending}
          onSelectedChatUserId={handleSelectChat}
          defaultChatUserId={selectedChatUserId}
        />
      </div>

      {/* ───────── RIGHT: Message Box ───────── */}
      <div className="hidden md:flex flex-1 flex-col">
        {selectedUser ? (
          <MessageBox
            receiverId={selectedUser.id}
            chatUser={selectedUser}
            isLoading={isPending}
            isChatuser
          />
        ) : (
          <div className="flex flex-1 items-center justify-center text-gray-400 text-sm">
            No conversation selected
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;