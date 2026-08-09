"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { RefreshCw, Search } from "lucide-react";

import { getChatUsers } from "@/actions/message/get-chat-users";
import { ChatUserItem } from "@/types";

import BottomDrawer from "@/components/BottomDrawer";
import { ChatLists } from "./ChatLists";
import MessageBox from "./MessageBox";

interface MessagesClientProps {
    currentUserId: number;
    initialChatUsers: ChatUserItem[];
}

const MessagesClient = ({
    currentUserId,
    initialChatUsers,
}: MessagesClientProps) => {
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);
    const [q, setQ] = useState("");

    const {
        data: chatUsers = [],
        isPending,
        isError,
        refetch,
    } = useQuery<ChatUserItem[]>({
        queryKey: ["chatUsers", currentUserId, q],
        queryFn: () => getChatUsers(currentUserId, q),
        initialData: initialChatUsers,
        staleTime: 1000 * 60,
        refetchInterval: 5000,
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
    });

    useEffect(() => {
        if (!selectedId && chatUsers.length > 0) {
            setSelectedId(chatUsers[0].id);
            return;
        }

        if (
            selectedId &&
            !chatUsers.some(
                (chatUser) => chatUser.id === selectedId
            )
        ) {
            setSelectedId(null);
            setIsMobileChatOpen(false);
        }
    }, [chatUsers, selectedId]);

    const selectedUser = useMemo(() => {
        return chatUsers.find(
            (chatUser) => chatUser.id === selectedId
        );
    }, [chatUsers, selectedId]);

    const handleSelectedChatUser = (id: number) => {
        setSelectedId(id);

        setIsMobileChatOpen(true);
    };

    const handleCloseMobileChat = (open: boolean) => {
        setIsMobileChatOpen(open);
    };

    if (isError) {
        return (
            <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
                <p className="text-sm font-medium text-red-500">
                    Failed to load conversations
                </p>

                <button
                    type="button"
                    onClick={() => refetch()}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                >
                    <RefreshCw
                        className="h-4 w-4"
                        strokeWidth={2}
                    />

                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="flex mt-3 h-[calc(100vh-78px)] w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">


            <div className="flex w-full min-w-0 flex-shrink-0 flex-col border-r border-slate-100 md:w-[300px] lg:w-[340px]">

                {/* Header */}
                <div className="flex-shrink-0 border-b border-slate-100 px-4 py-4">

                    <h2 className="mb-3 text-sm font-bold text-slate-800">
                        Messages
                    </h2>

                    {/* Conversation search */}
                    <div className="relative">

                        <Search
                            className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400"
                            strokeWidth={2}
                        />

                        <input
                            type="text"
                            value={q}
                            onChange={(event) =>
                                setQ(event.target.value)
                            }
                            placeholder="Search conversations..."
                            aria-label="Search conversations"
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/30"
                        />

                    </div>
                </div>

                {/* Conversation list */}
                <ChatLists
                    chatUsers={chatUsers}
                    isPending={isPending}
                    onSelectedChatUserId={
                        handleSelectedChatUser
                    }
                    defaultChatUserId={selectedId}
                />

            </div>


            <div className="hidden min-w-0 flex-1 flex-col overflow-hidden md:flex ">

                <MessageBox
                    receiverId={selectedUser?.id}
                    chatUser={selectedUser}
                    isLoading={isPending}
                    isChatuser
                    hasChatUsers={chatUsers.length > 0}
                />

            </div>


            <div className="lg:hidden">

                <BottomDrawer
                    open={
                        isMobileChatOpen &&
                        !!selectedUser
                    }
                    onOpenChange={
                        handleCloseMobileChat
                    }
                    title={
                        selectedUser ? (
                            <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-slate-900">
                                    {selectedUser.username}
                                </p>
                            </div>
                        ) : undefined
                    }
                >

                    {selectedUser && (
                        <MessageBox
                            receiverId={selectedUser.id}
                            chatUser={selectedUser}
                            isLoading={isPending}
                            isChatuser
                            hasChatUsers={chatUsers.length > 0}
                        />
                    )}

                </BottomDrawer>

            </div>

        </div>
    );
};

export default MessagesClient;