"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect as useEffectMB, useRef as useRefMB } from "react";
import { getConversation } from "@/actions/message/getConversation";
import MessageBoxSkeleton from "@/Skeletons/MessageBoxSkeleton";
import { markMessagesAsSeen } from "@/actions/message/markMessagesAsSeen ";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { MessageSquare } from "lucide-react";
import { ChatMessage, Chats } from "./Chats";
import { ChatUser } from "./ChatUser";
import { ChatButton } from "./ChatButton";

interface MessageBoxProps {
    receiverId?: number; chatUser?: ChatUserType;
    isLoading?: boolean; isChatuser?: boolean;
}
interface Conversation { id: number; messages: ChatMessage[]; }

export const MessageBox = ({ receiverId, chatUser, isLoading = false, isChatuser = false }: MessageBoxProps) => {
    const { user } = useCurrentUser();
    const queryClient = useQueryClient();
    const hasMarkedSeenRef = useRefMB(false);

    const { data: conversation, isPending } = useQuery<Conversation | null>({
        queryKey: ["conversation", user?.id, receiverId],
        queryFn: async () => {
            if (!user?.id || !receiverId) return null;
            return await getConversation(user.id, receiverId);
        },
        enabled: Boolean(user?.id && receiverId),
        staleTime: 1000 * 30,
        refetchInterval: receiverId ? 3000 : false,
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
    });

    useEffectMB(() => {
        const handleMarkSeen = async () => {
            if (!conversation?.id || !user?.id || hasMarkedSeenRef.current) return;
            try {
                const result = await markMessagesAsSeen(conversation.id, user.id);
                if (result?.success) {
                    hasMarkedSeenRef.current = true;
                    queryClient.invalidateQueries({ queryKey: ["getUnreadMessagesCount", user.id] });
                }
            } catch (err) { console.error("[markSeen]", err); }
        };
        handleMarkSeen();
    }, [conversation?.id, user?.id, queryClient]);

    useEffectMB(() => { hasMarkedSeenRef.current = false; }, [receiverId]);

    if (isPending || isLoading) return <div className="h-full flex flex-col"><MessageBoxSkeleton /></div>;

    if (!receiverId) {
        return (
            <div className="h-full flex flex-col items-center justify-center gap-3 text-center px-8">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-slate-300" strokeWidth={1.5} />
                </div>
                <p className="text-sm font-semibold text-slate-600">No conversation selected</p>
                <p className="text-xs text-slate-400">Select a chat from the left to start messaging.</p>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col overflow-hidden">
            <ChatUser chatUser={chatUser} isChatuser={isChatuser} />
            <div className="flex-1 overflow-hidden flex flex-col">
                <Chats
                    messages={conversation?.messages ?? []}
                    currentUserId={user?.id}
                    user={user}
                    isChatuser={isChatuser}
                />
            </div>
            {user?.id && <ChatButton userId={user.id} receiverId={receiverId} />}
        </div>
    );
};

export default MessageBox;