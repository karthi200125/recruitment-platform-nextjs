"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { RefreshCw, Search } from "lucide-react";

import { getChatUsers } from "@/actions/message/get-chat-users";
import { ChatUserItem } from "@/types";

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
        }
    }, [chatUsers, selectedId]);

    const selectedUser = useMemo(() => {
        return chatUsers.find((u) => u.id === selectedId);
    }, [chatUsers, selectedId]);

    if (isError) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
                <p className="text-sm font-medium text-red-500">
                    Failed to load conversations
                </p>

                <button
                    onClick={() => refetch()}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                    <RefreshCw className="h-4 w-4" />
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="flex h-[calc(100vh-68px)] w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            {/* Left */}

            <div className="flex w-full flex-shrink-0 flex-col border-r border-slate-100 md:w-[300px] lg:w-[340px]">

                <div className="flex-shrink-0 border-b border-slate-100 px-4 py-4">
                    <h2 className="mb-3 text-sm font-bold text-slate-800">
                        Messages
                    </h2>

                    <div className="relative">
                        <Search
                            className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400"
                            strokeWidth={2}
                        />

                        <input
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            placeholder="Search conversations..."
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/30"
                        />
                    </div>
                </div>

                <ChatLists
                    chatUsers={chatUsers}
                    isPending={isPending}
                    onSelectedChatUserId={setSelectedId}
                    defaultChatUserId={selectedId}
                />
            </div>

            {/* Right */}

            <div className="hidden flex-1 flex-col overflow-hidden md:flex">
                <MessageBox
                    receiverId={selectedUser?.id}
                    chatUser={selectedUser}
                    isLoading={isPending}
                    isChatuser
                />
            </div>
        </div>
    );
};

export default MessagesClient;