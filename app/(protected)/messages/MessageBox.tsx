"use client";

import { getConversation } from "@/actions/message/get-conversation";
import MessageBoxSkeleton from "@/components/skeletons/MessageBoxSkeleton";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { ChatMessage, ChatUserSummary } from "@/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

import { ChatButton } from "./ChatButton";
import { Chats } from "./Chats";
import { ChatUser } from "./ChatUser";
import ConversationEmptyState from "./ConversationEmptyState";
import { markMessagesAsSeen } from "@/actions/message/mark-messages-as-seen ";

interface MessageBoxProps {
  receiverId?: number;
  chatUser?: ChatUserSummary;
  isLoading?: boolean;
  isChatuser?: boolean;
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

  const currentUserId = user?.id;

  const {
    data: conversation,
    isPending,
    isError,
    error,
  } = useQuery<Conversation | null>({
    queryKey: [
      "conversation",
      currentUserId,
      receiverId,
    ],

    queryFn: async () => {
      if (
        !currentUserId ||
        !receiverId
      ) {
        return null;
      }

      return getConversation(
        currentUserId,
        receiverId
      );
    },

    enabled:
      Boolean(
        currentUserId &&
        receiverId
      ),

    staleTime: 30_000,

    refetchInterval:
      receiverId
        ? 5_000
        : false,

    refetchOnWindowFocus: true,

    refetchOnReconnect: true,
  });

  /*
   * Mark messages as seen
   */
  useEffect(() => {
    if (
      !conversation?.id ||
      !currentUserId
    ) {
      return;
    }

    const markSeen = async () => {
      try {
        const result =
          await markMessagesAsSeen(
            conversation.id,
            currentUserId
          );

        if (result?.success) {
          queryClient.invalidateQueries({
            queryKey: [
              "getUnreadMessagesCount",
              currentUserId,
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

    markSeen();
  }, [
    conversation?.id,
    conversation?.messages?.length,
    currentUserId,
    queryClient,
  ]);

  /*
   * Component loading
   */
  if (isLoading) {
    return <MessageBoxSkeleton />;
  }

  /*
   * We don't know who we're messaging yet.
   */
  if (!receiverId) {
    return <MessageBoxSkeleton />;
  }

  /*
   * React Query loading
   */
  if (isPending) {
    return <MessageBoxSkeleton />;
  }

  /*
   * IMPORTANT:
   *
   * Don't show "empty conversation" when
   * the request itself failed.
   */
  if (isError) {
    console.error(
      "[GET_CONVERSATION]",
      error
    );

    return (
      <div className="flex h-full min-h-0 items-center justify-center bg-white p-6">
        <p className="text-sm text-slate-500">
          Unable to load this conversation.
        </p>
      </div>
    );
  }

  /*
   * No chat exists yet.
   *
   * This is the TRUE empty state.
   */
  if (
    !conversation ||
    conversation.messages.length === 0
  ) {
    return (
      <div className="flex h-full min-h-0 flex-col bg-white">
        <ChatUser
          chatUser={chatUser}
          isChatuser={isChatuser}
        />

        <div className="flex min-h-0 flex-1 items-center justify-center">
          <ConversationEmptyState />
        </div>

        {currentUserId && (
          <ChatButton
            userId={currentUserId}
            receiverId={receiverId}
          />
        )}
      </div>
    );
  }

  /*
   * REAL CONVERSATION
   */
  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-white">

      <ChatUser
        chatUser={chatUser}
        isChatuser={isChatuser}
      />

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <Chats
          messages={
            conversation.messages
          }
          currentUserId={
            currentUserId
          }
          user={user}
          isChatuser={
            isChatuser
          }
        />
      </div>

      {currentUserId && (
        <ChatButton
          userId={currentUserId}
          receiverId={receiverId}
        />
      )}

    </div>
  );
};

export default MessageBox;