"use client";

import { getConversation } from "@/actions/message/get-conversation";
import MessageBoxSkeleton from "@/components/skeletons/MessageBoxSkeleton";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { ChatMessage, ChatUserSummary } from "@/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

import { markMessagesAsSeen } from "@/actions/message/mark-messages-as-seen ";
import { ChatButton } from "./ChatButton";
import { Chats } from "./Chats";
import { ChatUser } from "./ChatUser";
import ConversationEmptyState from "./ConversationEmptyState";
import ConversationTipBanner from "./ConversationTipBanner";

interface MessageBoxProps {
  receiverId?: number;
  chatUser?: ChatUserSummary;
  isLoading?: boolean;
  isChatuser?: boolean;
  // hasChatUsers: boolean;
}

interface Conversation {
  id: number;
  messages: ChatMessage[];
}

const MessageBox = ({
  receiverId,
  chatUser,
  isLoading = false,
  isChatuser = false,
  
}: MessageBoxProps) => {
  const { user } = useCurrentUser();
  const queryClient = useQueryClient();

  const {
    data: conversation,
    isPending,
  } = useQuery<Conversation | null>({
    queryKey: [
      "conversation",
      user?.id,
      receiverId,
    ],

    queryFn: async () => {
      if (!user?.id || !receiverId) {
        return null;
      }

      return await getConversation(
        user.id,
        receiverId
      );
    },

    enabled: Boolean(
      user?.id && receiverId
    ),

    staleTime: 1000 * 30,

    refetchInterval: receiverId
      ? 3000
      : false,

    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

  useEffect(() => {
    const handleMarkSeen = async () => {
      if (
        !conversation?.id ||
        !user?.id
      ) {
        return;
      }

      try {
        const result =
          await markMessagesAsSeen(
            conversation.id,
            user.id
          );

        if (result?.success) {
          queryClient.invalidateQueries({
            queryKey: [
              "getUnreadMessagesCount",
              user.id,
            ],
          });
        }
      } catch (error) {
        console.error(
          "[MARK_MESSAGES_AS_SEEN]",
          error
        );
      }
    };

    handleMarkSeen();
  }, [
    conversation?.id,
    conversation?.messages?.length,
    user?.id,
    queryClient,
  ]);

  if (isLoading) {
    return <MessageBoxSkeleton />;
  }

  // if (!hasChatUsers) {
  //   return (
  //     <div className="flex h-full min-h-0 flex-col bg-white">
  //       <div className="flex min-h-0 flex-1 items-center justify-center">
  //         <ConversationEmptyState />
  //       </div>
  //       <ConversationTipBanner />
  //     </div>
  //   );
  // }

  if (!receiverId) {
    return <MessageBoxSkeleton />;
  }

  if (isPending) {
    return <MessageBoxSkeleton />;
  }

  if (
    !conversation ||
    conversation.messages.length === 0
  ) {
    return (
      <div className="flex h-full min-h-0 flex-col bg-white">
        <ConversationEmptyState />
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-white">

      {/* User header */}
      <ChatUser
        chatUser={chatUser}
        isChatuser={isChatuser}
      />

      {/* Messages */}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <Chats
          messages={conversation.messages}
          currentUserId={user?.id}
          user={user}
          isChatuser={isChatuser}
        />
      </div>

      {/* Message input */}
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