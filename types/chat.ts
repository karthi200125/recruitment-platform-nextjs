import { Prisma } from "@prisma/client";

export type Chat = Prisma.ChatsGetPayload<{}>;

export type ChatWithMessages = Prisma.ChatsGetPayload<{
  include: {
    messages: true;
  };
}>;

export type ChatWithUsers = Prisma.ChatsGetPayload<{
  include: {
    sender: true;
    receiver: true;
  };
}>;

export type Message = Prisma.MessageGetPayload<{}>;