import { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            username: string;
            role: string | null;
            isPro: boolean;
            profileImage: string | null;
        } & DefaultSession["user"];
    }

    interface User {
        id: string;
        username: string;
        role: string | null;
        isPro: boolean;
        profileImage: string | null;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        username: string;
        role: string | null;
        isPro: boolean;
        profileImage: string | null;
    }
}