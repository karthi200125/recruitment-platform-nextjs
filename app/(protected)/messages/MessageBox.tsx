"use client";

import {
  useCallback,
  useEffect,
  useOptimistic,
} from "react";

import { getConversation } from "@/actions/message/get-conversation";
import { markMessagesAsSeen } from "@/actions/message/mark-messages-as-seen ";
import MessageBoxSkeleton from "@/components/skeletons/MessageBoxSkeleton";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import type {
  ChatMessage,
  ChatUserSummary,
} from "@/types";
import {
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import type { OptimisticMessage } from "./ChatButton";
import { ChatButton } from "./ChatButton";
import { ChatUser } from "./ChatUser";
import Chats from "./Chats";
import ConversationEmptyState from "./ConversationEmptyState";

interface MessageBoxProps {
  receiverId?: number | null;
  chatUser?: ChatUserSummary;
  isLoading?: boolean;
  isChatuser?: boolean;
}

interface Conversation {
  id: number;
  messages: ChatMessage[];
}

/*
 * ------------------------------------------------------------
 * OPTIMISTIC ACTION
 * ------------------------------------------------------------
 */

type OptimisticAction =
  | {
    type: "add";
    message: OptimisticMessage;
  }
  | {
    type: "error";
    tempId: string;
  };

/*
 * ------------------------------------------------------------
 * ID VALIDATION
 * ------------------------------------------------------------
 *
 * This prevents:
 *
 * number | undefined
 * number | null
 *
 * from being passed to functions/components that require
 * a real number.
 */

const isValidId = (
  value: number | null | undefined
): value is number => {
  return (
    typeof value === 'number' &&
    Number.isInteger(value) &&
    value > 0
  );
};

/*
 * ------------------------------------------------------------
 * MESSAGE BOX
 * ------------------------------------------------------------
 */

const MessageBox = ({
  receiverId,
  chatUser,
  isLoading = false,
  isChatuser = false,
}: MessageBoxProps) => {
  const { user } = useCurrentUser();
  const queryClient = useQueryClient();

  /*
   * Current logged-in user ID.
   */
  const currentUserId = user?.id;

  /*
   * ----------------------------------------------------------
   * VALID IDS
   * ----------------------------------------------------------
   */

  const hasValidUsers =
    isValidId(currentUserId) &&
    isValidId(receiverId) &&
    currentUserId !== receiverId;

  /*
   * IMPORTANT:
   *
   * These are only used after validation.
   *
   * They remain `number | undefined` here, but TypeScript
   * narrowing below guarantees they are numbers whenever
   * the actual chat UI is rendered.
   */

  /*
   * ----------------------------------------------------------
   * REACT QUERY
   * ----------------------------------------------------------
   */

  const {
    data: conversation,
    isPending,
    isError,
  } = useQuery<Conversation | null>({
    queryKey: [
      "conversation",
      currentUserId,
      receiverId,
    ],

    queryFn: async () => {
      /*
       * enabled prevents this normally.
       *
       * This extra guard guarantees that the server action
       * never receives undefined/null.
       */
      if (
        !isValidId(currentUserId) ||
        !isValidId(receiverId)
      ) {
        return null;
      }

      return getConversation(
        currentUserId,
        receiverId
      );
    },

    enabled: hasValidUsers,

    /*
     * Don't refetch immediately when switching back
     * to a recently opened conversation.
     */
    staleTime: 30_000,

    /*
     * Keep recently used conversations in cache.
     */
    gcTime: 5 * 60_000,

    /*
     * Don't refetch merely because the browser tab
     * becomes active again.
     */
    refetchOnWindowFocus: false,

    /*
     * Don't automatically refetch after reconnect.
     */
    refetchOnReconnect: false,

    /*
     * No polling.
     *
     * When you later add WebSocket/SSE, invalidate
     * this query when a new message arrives.
     */
    refetchInterval: false,

    retry: 1,
  });

  /*
   * ----------------------------------------------------------
   * OPTIMISTIC MESSAGES
   * ----------------------------------------------------------
   *
   * React's useOptimistic gives us temporary messages that
   * appear immediately while the server operation is running.
   *
   * These are NOT database messages.
   */

  const [
    optimisticMessages,
    dispatchOptimistic,
  ] = useOptimistic<
    OptimisticMessage[],
    OptimisticAction
  >(
    [],
    (currentMessages, action) => {
      switch (action.type) {
        case "add":
          return [
            ...currentMessages,
            action.message,
          ];

        case "error":
          return currentMessages.map(
            (message) =>
              message.tempId === action.tempId
                ? {
                  ...message,
                  status: "error",
                }
                : message
          );

        default:
          return currentMessages;
      }
    }
  );

  /*
   * ----------------------------------------------------------
   * OPTIMISTIC HANDLERS
   * ----------------------------------------------------------
   */

  const handleOptimisticMessage = useCallback(
    (message: OptimisticMessage) => {
      dispatchOptimistic({
        type: "add",
        message,
      });
    },
    [dispatchOptimistic]
  );

  const handleOptimisticError = useCallback(
    (tempId: string) => {
      dispatchOptimistic({
        type: "error",
        tempId,
      });
    },
    [dispatchOptimistic]
  );

  /*
   * ----------------------------------------------------------
   * MARK MESSAGES AS SEEN
   * ----------------------------------------------------------
   */

  useEffect(() => {
    if (
      !conversation?.id ||
      !isValidId(currentUserId) ||
      conversation.messages.length === 0
    ) {
      return;
    }

    let cancelled = false;

    const markAsSeen = async () => {
      try {
        const result =
          await markMessagesAsSeen(
            conversation.id,
            currentUserId
          );

        if (
          !cancelled &&
          result?.success
        ) {
          await queryClient.invalidateQueries({
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

    void markAsSeen();

    return () => {
      cancelled = true;
    };
  }, [
    conversation?.id,
    conversation?.messages.length,
    currentUserId,
    queryClient,
  ]);

  /*
   * ----------------------------------------------------------
   * LOADING
   * ----------------------------------------------------------
   */

  if (isLoading) {
    return <MessageBoxSkeleton />;
  }

  /*
   * ----------------------------------------------------------
   * INVALID USERS
   * ----------------------------------------------------------
   */

  if (!hasValidUsers) {
    return <MessageBoxSkeleton />;
  }

  /*
   * ----------------------------------------------------------
   * CONVERSATION LOADING
   * ----------------------------------------------------------
   */

  if (isPending) {
    return <MessageBoxSkeleton />;
  }

  /*
   * ----------------------------------------------------------
   * CONVERSATION ERROR
   * ----------------------------------------------------------
   */

  if (isError) {
    return (
      <div className="flex h-full min-h-0 items-center justify-center bg-white p-6">
        <p className="text-sm text-slate-500">
          Unable to load this conversation.
        </p>
      </div>
    );
  }

  /*
   * ----------------------------------------------------------
   * FROM HERE:
   *
   * TypeScript knows both IDs are valid numbers because
   * hasValidUsers was checked above.
   * ----------------------------------------------------------
   */

  const safeCurrentUserId =
    currentUserId as number;

  const safeReceiverId =
    receiverId as number;

  /*
   * ----------------------------------------------------------
   * NO CONVERSATION / EMPTY CONVERSATION
   * ----------------------------------------------------------
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
          {optimisticMessages.length > 0 ? (
            <Chats
              messages={[]}
              currentUserId={safeCurrentUserId}
              user={user}
              isChatuser={isChatuser}
              optimisticMessages={
                optimisticMessages
              }
            />
          ) : (
            <ConversationEmptyState />
          )}
        </div>

        <ChatButton
          userId={safeCurrentUserId}
          receiverId={safeReceiverId}
          onOptimisticMessage={
            handleOptimisticMessage
          }
          onOptimisticError={
            handleOptimisticError
          }
        />
      </div>
    );
  }

  /*
   * ----------------------------------------------------------
   * EXISTING CONVERSATION
   * ----------------------------------------------------------
   */

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-white">
      <ChatUser
        chatUser={chatUser}
        isChatuser={isChatuser}
      />

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <Chats
          messages={conversation.messages}
          currentUserId={safeCurrentUserId}
          user={user}
          isChatuser={isChatuser}
          optimisticMessages={
            optimisticMessages
          }
        />
      </div>

      <ChatButton
        userId={safeCurrentUserId}
        receiverId={safeReceiverId}
        onOptimisticMessage={
          handleOptimisticMessage
        }
        onOptimisticError={
          handleOptimisticError
        }
      />
    </div>
  );
};

export default MessageBox;