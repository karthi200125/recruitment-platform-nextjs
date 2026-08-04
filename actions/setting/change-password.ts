"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/authentication/authOptions";
import { db } from "@/lib/db";
import { ChangePasswordSchema } from "@/lib/SchemaTypes";
import { ActionResponse } from "@/types/settings";


export const changePassword = async (
    values: z.infer<typeof ChangePasswordSchema>
): Promise<ActionResponse> => {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return {
                error: "Unauthorized.",
            };
        }

        const validated = ChangePasswordSchema.safeParse(values);

        if (!validated.success) {
            return {
                error: "Invalid form fields.",
            };
        }

        const { currentPassword, newPassword } = validated.data;

        const user = await db.user.findUnique({
            where: {
                id: session.user.id,
            },
            select: {
                id: true,
                password: true,
                authProvider: true,
            },
        });

        if (!user) {
            return {
                error: "User not found.",
            };
        }

        if (user.authProvider !== "credentials") {
            return {
                error: "Password cannot be changed for this account.",
            };
        }

        if (!user.password) {
            return {
                error: "Password is not available for this account.",
            };
        }

        const isPasswordValid = await bcrypt.compare(
            currentPassword,
            user.password
        );

        if (!isPasswordValid) {
            return {
                error: "Current password is incorrect.",
            };
        }

        const isSamePassword = await bcrypt.compare(
            newPassword,
            user.password
        );

        if (isSamePassword) {
            return {
                error: "New password must be different from your current password.",
            };
        }

        const hashedPassword = await bcrypt.hash(
            newPassword,
            12
        );

        await db.user.update({
            where: {
                id: user.id,
            },
            data: {
                password: hashedPassword,
            },
        });

        return {
            success: "Password changed successfully.",
        };
    } catch (error) {
        console.error("[CHANGE_PASSWORD]", error);

        return {
            error: "Something went wrong. Please try again.",
        };
    }
};

export { ChangePasswordSchema };