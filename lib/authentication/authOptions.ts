import { db } from "@/lib/db";
import { LoginSchema } from "@/lib/SchemaTypes";
import { Role } from "@prisma/client";

import bcrypt from "bcryptjs";

import type { NextAuthOptions } from "next-auth";

import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
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
            },

            async authorize(credentials) {
                try {
                    const validatedFields =
                        LoginSchema.safeParse(credentials);

                    if (!validatedFields.success) {
                        return null;
                    }

                    const { email, password } = validatedFields.data;

                    const user = await db.user.findUnique({
                        where: {
                            email,
                        },

                        select: {
                            id: true,
                            username: true,
                            email: true,
                            password: true,
                            role: true,
                            isPro: true,
                            profileImage: true,
                        },
                    });

                    if (!user?.password) {
                        return null;
                    }

                    const isPasswordValid = await bcrypt.compare(
                        password,
                        user.password
                    );

                    if (!isPasswordValid) {
                        return null;
                    }

                    // Everything needed by jwt() is already here.
                    // No second DB lookup is necessary.
                    return {
                        id: user.id,
                        email: user.email,
                        username: user.username,
                        role: user.role,
                        isPro: user.isPro,
                        profileImage: user.profileImage ?? null,
                    };
                } catch (error) {
                    console.error("AUTHORIZATION_ERROR", error);

                    return null;
                }
            },
        }),

        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID ?? "",

            clientSecret:
                process.env.GOOGLE_CLIENT_SECRET ?? "",
        }),
    ],

    session: {
        strategy: "jwt",

        maxAge: 30 * 24 * 60 * 60,
    },

    jwt: {
        maxAge: 30 * 24 * 60 * 60,
    },

    secret: process.env.NEXTAUTH_SECRET,

    callbacks: {
        async jwt({
            token,
            user,
            account,
            trigger,
        }) {
            // ─────────────────────────────────────────────
            // FIRST LOGIN
            // ─────────────────────────────────────────────
            if (user) {
                // CREDENTIALS
                // authorize() already fetched everything we need.
                if (account?.provider === "credentials") {
                    token.id = Number(user.id);
                    token.email = user.email;
                    token.username = user.username;
                    token.role = user.role;
                    token.isPro = user.isPro;
                    token.profileImage = user.profileImage ?? null;

                    return token;
                }

                // GOOGLE
                // Ensure the Google user exists and get the
                // actual database user in one operation.
                if (account?.provider === "google" && user.email) {
                    const dbUser = await db.user.upsert({
                        where: {
                            email: user.email,
                        },

                        update: {},

                        create: {
                            email: user.email,
                            username: user.name ?? "Google User",
                            profileImage: user.image,
                        },

                        select: {
                            id: true,
                            username: true,
                            email: true,
                            role: true,
                            isPro: true,
                            profileImage: true,
                        },
                    });

                    token.id = dbUser.id;
                    token.email = dbUser.email;
                    token.username = dbUser.username;
                    token.role = dbUser.role;
                    token.isPro = dbUser.isPro;
                    token.profileImage = dbUser.profileImage;

                    return token;
                }
            }

            // ─────────────────────────────────────────────
            // SESSION UPDATE
            // ─────────────────────────────────────────────
            if (trigger === "update" && token.email) {
                const dbUser = await db.user.findUnique({
                    where: {
                        email: token.email,
                    },

                    select: {
                        id: true,
                        username: true,
                        email: true,
                        role: true,
                        isPro: true,
                        profileImage: true,
                    },
                });

                if (dbUser) {
                    token.id = dbUser.id;
                    token.email = dbUser.email;
                    token.username = dbUser.username;
                    token.role = dbUser.role;
                    token.isPro = dbUser.isPro;
                    token.profileImage = dbUser.profileImage;
                }
            }

            return token;
        },

        async session({
            session,
            token,
        }) {
            if (session.user) {
                session.user.id = token.id as number;
                session.user.email = token.email as string;
                session.user.username = token.username as string;
                session.user.role = token.role as Role | null;
                session.user.isPro = token.isPro as boolean;
                session.user.profileImage =
                    token.profileImage as string | null;
            }

            return session;
        },
    },

    pages: {
        signIn: "/signin",
    },

    debug: process.env.NODE_ENV === "development",
};