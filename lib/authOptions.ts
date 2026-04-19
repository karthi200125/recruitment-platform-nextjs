import { db } from "@/lib/db";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { LoginSchema } from "@/lib/SchemaTypes";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },

            async authorize(credentials) {
                const parsed = LoginSchema.safeParse({
                    email: credentials?.email,
                    password: credentials?.password,
                });

                if (!parsed.success) return null;

                const { email, password } = parsed.data;

                const user = await db.user.findUnique({
                    where: { email },
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

                if (!user || !user.password) return null;

                const isValid = await bcrypt.compare(password, user.password);
                if (!isValid) return null;

                return {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    role: user.role ?? null,
                    isPro: user.isPro,
                    profileImage: user.profileImage ?? null,
                };
            },
        }),

        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],

    secret: process.env.NEXTAUTH_SECRET,

    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60,
    },

    callbacks: {
        async jwt({ token, user, trigger, account }) {
            if (trigger === "signIn" && user) {

                if (account?.provider === "credentials") {
                    token.user = {
                        id: user.id as number,
                        username: (user as any).username,
                        email: user.email!,
                        role: (user as any).role ?? null,
                        isPro: (user as any).isPro,
                        profileImage: (user as any).profileImage ?? null,
                    };
                }

                if (account?.provider === "google" && token.email) {
                    let dbUser = await db.user.findUnique({
                        where: { email: token.email },
                    });

                    if (!dbUser) {
                        dbUser = await db.user.create({
                            data: {
                                email: token.email,
                                username: token.name ?? "User",
                                profileImage: token.picture ?? null,
                                role: null, 
                            },
                        });
                    }

                    token.user = {
                        id: dbUser.id,
                        username: dbUser.username,
                        email: dbUser.email,
                        role: dbUser.role ?? null,
                        isPro: dbUser.isPro,
                        profileImage: dbUser.profileImage ?? null,
                    };
                }
            }

            return token;
        },

        async session({ session, token }) {
            if (token.user) {
                session.user = token.user as any;
            }
            return session;
        },
    },

    pages: {
        signIn: "/signin",
    },
};