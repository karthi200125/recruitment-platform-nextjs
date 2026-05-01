
"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

import { getConversation } from "@/actions/message/getConversation";

import MessageBoxSkeleton from "@/Skeletons/MessageBoxSkeleton";

import { markMessagesAsSeen } from "@/actions/message/markMessagesAsSeen ";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import ChatButton from "./ChatButton";
import Chats from "./Chats";
import ChatUser from "./ChatUser";


interface ChatUserType {
  id: number;
  username?: string;
  userImage?: string | null;
  isPro?: boolean;
  role?: string;
}

interface Message {
  id: number;
  senderId: number;
  text?: string | null;
  image?: string | null;
  isSeen: boolean;
  createdAt: string;
}

interface Conversation {
  id: number;
  messages: Message[];
}

interface MessageBoxProps {
  receiverId?: number;
  chatUser?: ChatUserType;
  isLoading?: boolean;
  isChatuser?: boolean;
}


const MessageBox = ({
  receiverId,
  chatUser,
  isLoading = false,
  isChatuser = false,
}: MessageBoxProps) => {
  const { user } = useCurrentUser()

  const queryClient = useQueryClient();

  const {
    data: conversation,
    isPending,
  } = useQuery<Conversation | null>({
    queryKey: ["conversation", user?.id, receiverId],
    queryFn: async () => {
      if (!user?.id || !receiverId) return null;

      return await getConversation(user.id, receiverId);
    },
    enabled: Boolean(user?.id && receiverId),
    staleTime: 1000 * 30,
  });


  useEffect(() => {
    const handleMarkSeen = async () => {
      if (!conversation?.id || !user?.id) return;

      try {
        const result = await markMessagesAsSeen(
          conversation.id,
          user.id
        );

        if (result?.success) {
          queryClient.invalidateQueries({
            queryKey: ["getUnreadMessagesCount", user.id],
          });
        }
      } catch (error) {
        console.error(
          "[MessageBox] Failed to mark messages as seen:",
          error
        );
      }
    };

    handleMarkSeen();
  }, [conversation?.id, user?.id, queryClient]);


  if (isPending || isLoading) {
    return (
      <div className="h-full relative">
        <MessageBoxSkeleton />
      </div>
    );
  }


  if (!receiverId) {
    return (
      <div className="h-full flex items-center justify-center text-sm text-neutral-400">
        No user selected yet.
      </div>
    );
  }


  return (
    <div className="h-full relative flex flex-col">
      <ChatUser
        chatUser={chatUser}
        isChatuser={isChatuser}
      />

      <Chats
        messages={conversation?.messages ?? []}
        currentUserId={user?.id}
        user={user}
        isChatuser={isChatuser}
      />

      {user?.id && (
        <ChatButton
          userId={user.id}
          receiverId={receiverId}
        />
      )}
    </div>
  );
};

export default MessageBox;

