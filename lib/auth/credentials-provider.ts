import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import { db } from "@/lib/db";

export const credentialsProvider = CredentialsProvider({
    name: "Credentials",

    credentials: {
        email: {
            label: "Email",
            type: "email",
        },
        password: {
            label: "Password",
            type: "password",
        },
        role: {
            label: "Role",
            type: "text",
        },
    },

    async authorize(credentials) {
        try {
            if (
                !credentials?.email?.trim() ||
                !credentials?.password ||
                !credentials?.role
            ) {
                throw new Error("Missing required credentials");
            }

            const email = credentials.email.trim().toLowerCase();
            const password = credentials.password;
            const role = credentials.role;

            const existingUser = await db.user.findUnique({
                where: { email },
                select: {
                    id: true,
                    email: true,
                    username: true,
                    password: true,
                    role: true,
                    isPro: true,
                    profileImage: true,
                },
            });

            if (!existingUser || !existingUser.password) {
                throw new Error("Invalid email or password");
            }

            const isPasswordValid = await bcrypt.compare(
                password,
                existingUser.password
            );

            if (!isPasswordValid) {
                throw new Error("Invalid email or password");
            }

            if (existingUser.role !== role) {
                throw new Error("Selected role does not match account");
            }

            return {
                id: existingUser.id,
                email: existingUser.email,
                name: existingUser.username,
                role: existingUser.role,
                isPro: existingUser.isPro,
                profileImage: existingUser.profileImage,
            };
        } catch (error) {
            console.error(
                "[AUTH_CREDENTIALS_AUTHORIZE_ERROR]",
                error
            );

            throw error;
        }
    },
});