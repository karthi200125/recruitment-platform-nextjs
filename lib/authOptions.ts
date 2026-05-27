import { db } from "@/lib/db";
import { LoginSchema } from "@/lib/SchemaTypes";

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

                    const { email, password } =
                        validatedFields.data;

                    const user =
                        await db.user.findUnique({
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

                    if (!user || !user.password) {
                        return null;
                    }

                    const isPasswordValid =
                        await bcrypt.compare(
                            password,
                            user.password
                        );

                    if (!isPasswordValid) {
                        return null;
                    }

                    // ✅ IMPORTANT
                    // NextAuth expects string id
                    return {
                        id: String(user.id),
                        email: user.email,
                        username: user.username,
                        role: user.role,
                        isPro: user.isPro,
                        profileImage: user.profileImage ?? null,
                    };
                } catch (error) {
                    console.error(
                        "AUTHORIZATION_ERROR",
                        error
                    );

                    return null;
                }
            },
        }),

        GoogleProvider({
            clientId:
                process.env.GOOGLE_CLIENT_ID ??
                "",

            clientSecret:
                process.env
                    .GOOGLE_CLIENT_SECRET ??
                "",
        }),
    ],

    session: {
        strategy: "jwt",

        maxAge:
            30 * 24 * 60 * 60,
    },

    jwt: {
        maxAge:
            30 * 24 * 60 * 60,
    },

    secret:
        process.env
            .NEXTAUTH_SECRET,

    callbacks: {
        // ✅ GOOGLE DB SYNC
        async signIn({
            user,
            account,
        }) {
            try {
                if (
                    account?.provider ===
                    "google"
                ) {
                    if (!user.email) {
                        return false;
                    }

                    const existingUser =
                        await db.user.findUnique({
                            where: {
                                email:
                                    user.email,
                            },
                        });

                    // CREATE USER IF NOT EXISTS
                    if (!existingUser) {
                        await db.user.create({
                            data: {
                                email: user.email,
                                username: user.name ?? "Google User",
                                profileImage: user.image,
                            },
                        });
                    }
                }

                return true;
            } catch (error) {
                console.error(
                    "GOOGLE_SIGNIN_ERROR",
                    error
                );

                return false;
            }
        },

        async jwt({
            token,
            user,
            trigger,
        }) {
            // FIRST LOGIN
            if (user?.email) {
                const dbUser =
                    await db.user.findUnique({
                        where: {
                            email: user.email,
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
                    token.id = String(dbUser.id);
                    token.email = dbUser.email;
                    token.username = dbUser.username;
                    token.role = dbUser.role;
                    token.isPro = dbUser.isPro;
                    token.profileImage = dbUser.profileImage;
                }
            }

            // SESSION UPDATE
            if (
                trigger === "update" &&
                token.email
            ) {
                const dbUser =
                    await db.user.findUnique({
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
                    token.id = String(dbUser.id);
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
                session.user.id = token.id as string;
                session.user.email = token.email as string;
                session.user.username = token.username as string;
                session.user.role = token.role as string;
                session.user.isPro = token.isPro as boolean;
                session.user.profileImage = token.profileImage as | string | null;
            }

            return session;
        },
    },

    pages: {
        signIn: "/signin",
    },

    debug:
        process.env.NODE_ENV === "development",
};