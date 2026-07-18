"use server";

import * as z from "zod";
import { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth/authOptions";
import { db } from "@/lib/db";
import { UserInfoSchema } from "@/lib/SchemaTypes";

interface ActionResponse<T = unknown> {
    success?: string;
    error?: string;
    data?: T;
}

export const UserUpdate = async (
    values: z.infer<typeof UserInfoSchema>,
    userAbout?: string
): Promise<ActionResponse> => {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return { error: "Unauthorized." };
        }

        const userId = session.user.id;

        const validated = UserInfoSchema.safeParse(values);

        if (!validated.success) {
            return { error: "Invalid form fields." };
        }

        const data = validated.data;

        const existingUser = await db.user.findUnique({
            where: { id: userId },
            select: { id: true },
        });

        if (!existingUser) {
            return { error: "User not found." };
        }

        const usernameExists = await db.user.findFirst({
            where: {
                username: data.username,
                NOT: {
                    id: userId,
                },
            },
            select: {
                id: true,
            },
        });

        if (usernameExists) {
            return {
                error: "Username is already taken.",
            };
        }

        const updatedUser = await db.user.update({
            where: {
                id: userId,
            },
            data: {
                ...data,
                userAbout:
                    userAbout !== undefined
                        ? userAbout
                        : Prisma.JsonNull,
            },
        });

        return {
            success: "Profile updated successfully.",
            data: updatedUser,
        };
    } catch (error) {
        console.error("[USER_UPDATE]", error);

        return {
            error: "Something went wrong. Please try again.",
        };
    }
};