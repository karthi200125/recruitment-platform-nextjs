import { getServerSession } from "next-auth";


import { getChatUsers } from "@/actions/message/get-chat-users";
import { authOptions } from "@/lib/auth/authOptions";
import MessagesClient from "./MessageClient";

const MessagesPage = async () => {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <p className="text-sm text-slate-500">
                    Please sign in to view messages.
                </p>
            </div>
        );
    }

    const chatUsers = await getChatUsers(session.user.id);

    return (
        <MessagesClient
            currentUserId={session.user.id}
            initialChatUsers={chatUsers}
        />
    );
};

export default MessagesPage;