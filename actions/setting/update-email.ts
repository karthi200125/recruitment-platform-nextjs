"use server";

import { getServerSession } from "next-auth";
import * as z from "zod";

import { authOptions } from "@/lib/authentication/authOptions";
import { db } from "@/lib/db";
import { ChangeEmailSchema } from "@/lib/SchemaTypes";
import { ActionResponse } from "@/types/settings";

export const changeEmail = async (
    values: z.infer<typeof ChangeEmailSchema>
): Promise<ActionResponse> => {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return {
                error: "Unauthorized.",
            };
        }

        const validated = ChangeEmailSchema.safeParse(values);

        if (!validated.success) {
            return {
                error: "Invalid email address.",
            };
        }

        const { email } = validated.data;

        const user = await db.user.findUnique({
            where: {
                id: session.user.id,
            },
            select: {
                id: true,
                email: true,
            },
        });

        if (!user) {
            return {
                error: "User not found.",
            };
        }

        if (user.email.toLowerCase() === email.toLowerCase()) {
            return {
                error: "Please enter a different email address.",
            };
        }

        const emailExists = await db.user.findFirst({
            where: {
                email: {
                    equals: email,
                    mode: "insensitive",
                },
                NOT: {
                    id: user.id,
                },
            },
            select: {
                id: true,
            },
        });

        if (emailExists) {
            return {
                error: "Email is already in use.",
            };
        }

        const updatedUser = await db.user.update({
            where: {
                id: user.id,
            },
            data: {
                email,
            },
            select: {
                id: true,
                email: true,
            },
        });

        return {
            success: "Email updated successfully.",
            data: updatedUser,
        };
    } catch (error) {
        console.error("[CHANGE_EMAIL]", error);

        return {
            error: "Something went wrong. Please try again.",
        };
    }
};

export { ChangeEmailSchema };
