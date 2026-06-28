import { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: number;
            username: string;
            role: string | null;
            isPro: boolean;
            profileImage: string | null;
        } & DefaultSession["user"];
    }

    interface User {
        id: number;
        username: string;
        role: string | null;
        isPro: boolean;
        profileImage: string | null;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: number;
        username: string;
        role: string | null;
        isPro: boolean;
        profileImage: string | null;
    }
}