"use client";

import { useQuery } from "@tanstack/react-query";
import { getChatUsers } from "@/actions/message/getChatUsers";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Search, RefreshCw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ChatLists, ChatUser } from "./ChatLists";
import MessageBox from "./MessageBox";

const Messages = () => {
    const { user } = useCurrentUser();
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [q, setQ] = useState("");

    const { data: chatUsers = [], isPending, isError, refetch } = useQuery<ChatUser[]>({
        queryKey: ["chatUsers", user?.id, q],
        queryFn: async () => {
            if (!user?.id) return [];
            return await getChatUsers(user.id, q);
        },
        enabled: !!user?.id,
        staleTime: 1000 * 60,
        refetchInterval: user?.id ? 5000 : false,
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
    });

    useEffect(() => {
        if (!selectedId && chatUsers.length > 0) setSelectedId(chatUsers[0].id);
    }, [chatUsers, selectedId]);

    const selectedUser = useMemo(() => chatUsers.find((u) => u.id === selectedId) ?? null, [chatUsers, selectedId]);

    if (!user) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <p className="text-sm text-slate-500">Please sign in to view messages.</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
                <p className="text-sm text-red-500 font-medium">Failed to load conversations</p>
                <button onClick={() => refetch()} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors duration-200">
                    <RefreshCw className="w-4 h-4" strokeWidth={2} />
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="w-full h-[calc(100vh-64px)] flex bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">

            {/* LEFT — chat list */}
            <div className="w-full md:w-[300px] lg:w-[340px] flex-shrink-0 flex flex-col border-r border-slate-100">

                {/* Header */}
                <div className="px-4 py-4 border-b border-slate-100 flex-shrink-0">
                    <h2 className="text-sm font-bold text-slate-800 mb-3">Messages</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" strokeWidth={2} />
                        <input
                            type="text"
                            placeholder="Search conversations..."
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/30 transition-all duration-200"
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

            {/* RIGHT — message panel */}
            <div className="hidden md:flex flex-col flex-1 overflow-hidden">
                <MessageBox
                    receiverId={selectedUser?.id}
                    chatUser={selectedUser ?? undefined}
                    isLoading={isPending}
                    isChatuser
                />
            </div>
        </div>
    );
};

export default Messages;