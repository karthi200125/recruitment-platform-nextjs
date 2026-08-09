import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { getChatUsers } from "@/actions/message/get-chat-users";
import { authOptions } from "@/lib/authentication/authOptions";
import MessagesClient from "./MessageClient";

export const metadata: Metadata = {
    title: "Messages | Jobify",

    description:
        "Manage your conversations and connect with candidates, recruiters, and companies on Jobify.",

    robots: {
        index: false,
        follow: false,
        nocache: true,
        googleBot: {
            index: false,
            follow: false,
            noimageindex: true,
            noarchive: true,
            nosnippet: true,
            notranslate: true,
        },
    },

    referrer: "strict-origin-when-cross-origin",

    applicationName: "Jobify",

    category: "jobs",

    other: {
        "format-detection": "telephone=no",
    },
};

const MessagesPage = async () => {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        redirect("/signin?callbackUrl=/messages");
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