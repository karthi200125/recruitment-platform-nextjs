import { PrismaClient } from "@prisma/client";

const TOTAL_CHATS = 60;

const MESSAGE_SETS = [
    [
        "Hi, I came across your profile and wanted to discuss a role with you.",
        "Hi! Thanks for reaching out. I'd be happy to hear more about the opportunity.",
        "We are currently hiring for a Software Engineer position.",
        "That sounds interesting. Could you share some details about the role?",
        "Sure. It is a full-stack position working primarily with React and Node.js.",
        "That matches my experience. I'd definitely be interested in learning more.",
    ],
    [
        "Hello! I saw your application for our developer position.",
        "Hi, thank you for reaching out.",
        "Your profile looks interesting and we'd like to move forward.",
        "That's great to hear!",
        "Are you available for an interview this week?",
        "Yes, I'm available. Please let me know the preferred time.",
    ],
    [
        "Hi, are you currently open to new opportunities?",
        "Yes, I'm actively looking for software development roles.",
        "Great. We have an opening that might be a good fit.",
        "Could you send me the job details?",
        "Absolutely. I'll share the position with you.",
        "Thank you. I'll take a look and get back to you.",
    ],
    [
        "Hello, I wanted to follow up regarding your application.",
        "Hi! Sure, any updates?",
        "The hiring team is currently reviewing your profile.",
        "Thanks for the update.",
        "We'll get back to you once we have the next steps.",
        "Sounds good. I appreciate the update.",
    ],
    [
        "Hi! Your experience caught my attention.",
        "Thank you! What kind of opportunity are you hiring for?",
        "We're looking for a frontend engineer with React and TypeScript experience.",
        "That sounds like a good match for me.",
        "Would you be interested in a quick discussion?",
        "Yes, definitely.",
    ],
    [
        "Hey, I noticed you applied for our position.",
        "Yes, I'm very interested in the role.",
        "Could you tell me a little about your recent projects?",
        "Sure. I've recently worked on a SaaS project using Next.js and PostgreSQL.",
        "That's great. Your background looks relevant.",
        "Thank you!",
    ],
    [
        "Hello! Are you available for a quick call tomorrow?",
        "Yes, what time works for you?",
        "Would 11 AM work?",
        "Yes, 11 AM works for me.",
        "Perfect. I'll send the meeting details shortly.",
        "Great, thank you.",
    ],
    [
        "Hi, I wanted to ask whether you are interested in remote opportunities.",
        "Yes, remote work is something I'm currently considering.",
        "We have several remote positions available.",
        "Could you share the relevant openings?",
        "Sure, I'll send them over.",
        "Thanks!",
    ],
];

function randomItem<T>(
    items: T[]
): T {
    return items[
        Math.floor(
            Math.random() * items.length
        )
    ];
}

function randomPastDate(
    minDays: number,
    maxDays: number
) {
    const days =
        Math.floor(
            Math.random() *
            (maxDays - minDays + 1)
        ) + minDays;

    return new Date(
        Date.now() -
        days *
        24 *
        60 *
        60 *
        1000
    );
}

function addMinutes(
    date: Date,
    minutes: number
) {
    return new Date(
        date.getTime() +
        minutes * 60 * 1000
    );
}

export async function seedChatsMessages(
    prisma: PrismaClient
) {
    console.log(
        "💬 Seeding chats and messages..."
    );

    /*
     * DEV SEED ONLY
     *
     * Messages depend on chats, so delete
     * messages first.
     */
    await prisma.message.deleteMany();

    await prisma.chats.deleteMany();

    /*
     * Get users by role.
     */
    const candidates =
        await prisma.user.findMany({
            where: {
                role: "CANDIDATE",
            },
            select: {
                id: true,
            },
        });

    const recruiters =
        await prisma.user.findMany({
            where: {
                role: "RECRUITER",
            },
            select: {
                id: true,
            },
        });

    const organizations =
        await prisma.user.findMany({
            where: {
                role: "ORGANIZATION",
            },
            select: {
                id: true,
            },
        });

    if (
        candidates.length === 0 ||
        recruiters.length === 0
    ) {
        throw new Error(
            "Candidates and recruiters are required before seeding chats."
        );
    }

    /*
     * All possible hiring-side users.
     */
    const hiringUsers = [
        ...recruiters,
        ...organizations,
    ];

    /*
     * Prevent duplicate directional chats.
     *
     * Your schema has:
     *
     * @@unique([senderId, receiverId])
     */
    const usedChats =
        new Set<string>();

    let chatsCreated = 0;
    let messagesCreated = 0;

    let attempts = 0;

    while (
        chatsCreated < TOTAL_CHATS &&
        attempts < 10000
    ) {
        attempts++;

        /*
         * Most conversations:
         *
         * Candidate → Recruiter
         *
         * Some:
         *
         * Recruiter → Candidate
         */
        const candidate =
            randomItem(candidates);

        const hiringUser =
            randomItem(hiringUsers);

        const candidateFirst =
            Math.random() < 0.75;

        const senderId =
            candidateFirst
                ? candidate.id
                : hiringUser.id;

        const receiverId =
            candidateFirst
                ? hiringUser.id
                : candidate.id;

        const chatKey =
            `${senderId}-${receiverId}`;

        if (
            usedChats.has(chatKey)
        ) {
            continue;
        }

        usedChats.add(chatKey);

        /*
         * Conversation starts sometime
         * within the last 90 days.
         */
        const conversationDate =
            randomPastDate(
                5,
                90
            );

        const messageSet =
            randomItem(
                MESSAGE_SETS
            );

        /*
         * Use between 4 and all messages
         * from the conversation template.
         */
        const messageCount =
            Math.floor(
                Math.random() *
                4
            ) + 4;

        const selectedMessages =
            messageSet.slice(
                0,
                Math.min(
                    messageCount,
                    messageSet.length
                )
            );

        /*
         * Create the chat first.
         */
        const chat =
            await prisma.chats.create({
                data: {
                    senderId,
                    receiverId,

                    lastMessage: null,
                    lastMessageAt: null,

                    /*
                     * Most chats are already read,
                     * but leave some unread.
                     */
                    isSeen:
                        Math.random() <
                        0.8,

                    createdAt:
                        conversationDate,
                },
            });

        /*
         * Create messages chronologically.
         */
        let lastMessageText =
            "";

        let lastMessageDate =
            conversationDate;

        for (
            let i = 0;
            i <
            selectedMessages.length;
            i++
        ) {
            /*
             * Alternate between the two
             * participants.
             */
            const messageSenderId =
                i % 2 === 0
                    ? senderId
                    : receiverId;

            const messageDate =
                addMinutes(
                    conversationDate,
                    (i + 1) *
                    (5 +
                        Math.floor(
                            Math.random() *
                            120
                        ))
                );

            const text =
                selectedMessages[i];

            await prisma.message.create({
                data: {
                    chatId: chat.id,

                    senderId:
                        messageSenderId,

                    text,

                    /*
                     * image intentionally omitted.
                     *
                     * Your schema makes it optional.
                     */
                },
            });

            lastMessageText = text;
            lastMessageDate =
                messageDate;

            messagesCreated++;
        }

        /*
         * Update chat preview with
         * the latest message.
         */
        await prisma.chats.update({
            where: {
                id: chat.id,
            },
            data: {
                lastMessage:
                    lastMessageText,

                lastMessageAt:
                    lastMessageDate,

                /*
                 * Randomly create some unread
                 * conversations.
                 */
                isSeen:
                    Math.random() <
                    0.75,
            },
        });

        chatsCreated++;

        if (
            chatsCreated % 10 ===
            0
        ) {
            console.log(
                `   ✅ ${chatsCreated}/${TOTAL_CHATS} chats`
            );
        }
    }

    console.log(
        `\n   🎉 Total chats: ${chatsCreated}`
    );

    console.log(
        `   💬 Total messages: ${messagesCreated}`
    );
}