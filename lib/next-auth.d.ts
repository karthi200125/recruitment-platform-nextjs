import { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: number; // ✅ Change to string if your Prisma schema uses cuid()/uuid()
            username: string;
            email: string;
            role: string;
            isPro: boolean;
            profileImage?: string | null;
        } & DefaultSession["user"];
    }

    interface User {
        id: number;
        username: string;
        email: string;
        role: string;
        isPro: boolean;
        profileImage?: string | null;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        user?: {
            id: number;
            username: string;
            email: string;
            role: string;
            isPro: boolean;
            profileImage?: string | null;
        };
    }
}