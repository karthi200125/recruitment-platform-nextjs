import { Prisma, Role } from "@prisma/client";

export type Chat = Prisma.ChatsGetPayload<{}>;

export type Message = Prisma.MessageGetPayload<{}>;

export type ChatWithMessages = Prisma.ChatsGetPayload<{
  include: {
    messages: true;
  };
}>;

export type ChatWithUsers = Prisma.ChatsGetPayload<{
  include: {
    userOne: true;
    userTwo: true;
    messages: true;
  };
}>;

interface Sender {
  id: number;
  userImage: string | null;
}

export interface ChatMessage {
  id: number;
  senderId: number;

  text: string | null;
  image: string | null;

  file: string | null;
  fileName: string | null;
  fileType: string | null;

  isSeen: boolean;

  createdAt: string | Date;

  sender: Sender;
}

export interface ConversationData {
  id: number;
  messages: ChatMessage[];
}

export interface ChatUserSummary {
  id: number;
  username: string;
  userImage: string | null;
  profession?: string | null;
  role?: Role | null;
  isPro?: boolean;
}

export interface ChatUserItem extends ChatUserSummary {
  lastMessage: string | null;
  isSeen: boolean;
  createdAt: Date;
  updatedAt: Date;
}


export interface SendMessagePayload {
  receiverId: number;
  text: string;
}