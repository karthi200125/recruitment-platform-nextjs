import { Prisma } from "@prisma/client";

export type Chat = Prisma.ChatsGetPayload<{}>;

export type ChatWithMessages = Prisma.ChatsGetPayload<{
  include: {
    messages: true;
  };
}>;

interface Sender {
  id: number;
  userImage?: string | null;
}

export interface ChatMessage {
  id: number;
  senderId: number;
  text?: string | null;
  image?: string | null;
  file?: string | null;
  fileName?: string | null;
  fileType?: string | null;
  createdAt: string | Date;
  sender?: Sender;
}


export type Message = Prisma.MessageGetPayload<{}>;