import { DefaultSession, DefaultUser } from "next-auth";
import { Role } from "@prisma/client";

declare module "next-auth" {
    interface Session {
        user: {
            id: number;
            username: string;
            role: Role | null;
            isPro: boolean;
            profileImage: string | null;
        } & DefaultSession["user"];
    }

    interface User extends DefaultUser {
        id: number;
        username: string;
        role: Role | null;
        isPro: boolean;
        profileImage: string | null;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: number;
        username: string;
        role: Role | null;
        isPro: boolean;
        profileImage: string | null;
    }
}