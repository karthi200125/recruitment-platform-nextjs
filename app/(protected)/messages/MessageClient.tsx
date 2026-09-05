"use client";

import {
    useCallback,
    useDeferredValue,
    useEffect,
    useMemo,
    useState,
} from "react";

import { Search } from "lucide-react";

import type { ChatUserItem } from "@/types";

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
    const [chatUsers, setChatUsers] =
        useState<ChatUserItem[]>(initialChatUsers);

    const [selectedId, setSelectedId] =
        useState<number | null>(
            initialChatUsers[0]?.id ?? null
        );

    const [isMobileChatOpen, setIsMobileChatOpen] =
        useState(false);

    const [q, setQ] = useState("");

    /*
     * useDeferredValue keeps typing smooth even if
     * the conversation list becomes large.
     */
    const deferredSearch = useDeferredValue(q);

    /*
     * Keep the conversation list synchronized if
     * the server sends a new initial list after
     * navigation.
     */
    useEffect(() => {
        setChatUsers(initialChatUsers);
    }, [initialChatUsers]);

    /*
     * Search locally.
     *
     * IMPORTANT:
     * We do NOT call the database for every
     * character the user types.
     */
    const filteredChatUsers = useMemo(() => {
        const search = deferredSearch.trim().toLowerCase();

        if (!search) {
            return chatUsers;
        }

        return chatUsers.filter((user) =>
            user.username
                .toLowerCase()
                .includes(search)
        );
    }, [chatUsers, deferredSearch]);

    /*
     * Keep selected conversation valid.
     */
    useEffect(() => {
        if (chatUsers.length === 0) {
            setSelectedId(null);
            setIsMobileChatOpen(false);
            return;
        }

        const selectedStillExists = chatUsers.some(
            (user) => user.id === selectedId
        );

        if (!selectedStillExists) {
            setSelectedId(chatUsers[0].id);
        }
    }, [chatUsers, selectedId]);

    /*
     * Find the currently selected conversation.
     */
    const selectedUser = useMemo(() => {
        if (selectedId === null) {
            return undefined;
        }

        return chatUsers.find(
            (user) => user.id === selectedId
        );
    }, [chatUsers, selectedId]);

    /*
     * Select conversation.
     */
    const handleSelectedChatUser = useCallback(
        (id: number) => {
            setSelectedId(id);
            setIsMobileChatOpen(true);
        },
        []
    );

    /*
     * Close mobile chat.
     */
    const handleCloseMobileChat = useCallback(
        (open: boolean) => {
            setIsMobileChatOpen(open);
        },
        []
    );

    return (
        <div className="mt-3 flex h-[calc(100vh-78px)] w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            {/* =========================================================
                CONVERSATION SIDEBAR
            ========================================================= */}

            <div className="flex w-full min-w-0 flex-shrink-0 flex-col border-r border-slate-100 md:w-[300px] lg:w-[340px]">

                {/* Header */}
                <div className="flex-shrink-0 border-b border-slate-100 px-4 py-4">

                    <h2 className="mb-3 text-sm font-bold text-slate-800">
                        Messages
                    </h2>

                    {/* Search */}
                    <div className="relative">

                        <Search
                            className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400"
                            strokeWidth={2}
                            aria-hidden="true"
                        />

                        <input
                            type="search"
                            value={q}
                            onChange={(event) =>
                                setQ(event.target.value)
                            }
                            placeholder="Search conversations..."
                            aria-label="Search conversations"
                            autoComplete="off"
                            spellCheck={false}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/30"
                        />

                    </div>
                </div>

                {/* Conversation list */}
                <ChatLists
                    chatUsers={filteredChatUsers}
                    isPending={false}
                    onSelectedChatUserId={
                        handleSelectedChatUser
                    }
                    defaultChatUserId={selectedId}
                />
            </div>

            {/* =========================================================
                DESKTOP CHAT
            ========================================================= */}

            <div className="hidden min-w-0 flex-1 flex-col overflow-hidden md:flex">

                <MessageBox
                    receiverId={selectedUser?.id}
                    chatUser={selectedUser}
                    isLoading={false}
                    isChatuser
                />

            </div>

            {/* =========================================================
                MOBILE CHAT
            ========================================================= */}

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
                            isLoading={false}
                            isChatuser
                        />
                    )}

                </BottomDrawer>

            </div>

        </div>
    );
};

export default MessagesClient;