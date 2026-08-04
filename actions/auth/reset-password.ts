"use server";

import crypto from "crypto";

import bcrypt from "bcryptjs";

import * as z from "zod";

import { db } from "@/lib/db";

import { rateLimit } from "@/lib/authentication/rateLimit";

// ─────────────────────────────────────────────
// PASSWORD SCHEMA
// ─────────────────────────────────────────────

const ResetPasswordSchema = z.object({
    token: z.string().min(1),

    password: z
        .string()
        .min(
            8,
            "Password must be at least 8 characters"
        )
        .regex(
            /[A-Z]/,
            "Password must contain at least one uppercase letter"
        )
        .regex(
            /[0-9]/,
            "Password must contain at least one number"
        ),
});

// ─────────────────────────────────────────────
// RESPONSE TYPE
// ─────────────────────────────────────────────

type ResetPasswordResponse = {
    success: boolean;
    error?: string;
};

// ─────────────────────────────────────────────
// RESET PASSWORD
// ─────────────────────────────────────────────

export const resetPassword = async (
    token: string,
    password: string
): Promise<ResetPasswordResponse> => {
    try {
        // ───────────────────────────────────────
        // RATE LIMIT
        // ───────────────────────────────────────

        await rateLimit(
            `reset-password:${token}`
        );

        // ───────────────────────────────────────
        // VALIDATE INPUT
        // ───────────────────────────────────────

        const validatedFields =
            ResetPasswordSchema.safeParse({
                token,
                password,
            });

        if (!validatedFields.success) {
            return {
                success: false,
                error: "Invalid input",
            };
        }

        // ───────────────────────────────────────
        // HASH TOKEN
        // ───────────────────────────────────────

        const hashedToken =
            crypto
                .createHash("sha256")
                .update(token)
                .digest("hex");

        // ───────────────────────────────────────
        // FIND USER
        // ───────────────────────────────────────

        const user =
            await db.user.findFirst({
                where: {
                    resetPasswordToken:
                        hashedToken,

                    resetPasswordExpires: {
                        gt: new Date(),
                    },
                },

                select: {
                    id: true,
                },
            });

        // ───────────────────────────────────────
        // INVALID TOKEN
        // ───────────────────────────────────────

        if (!user) {
            return {
                success: false,
                error:
                    "Reset link expired or invalid",
            };
        }

        // ───────────────────────────────────────
        // HASH PASSWORD
        // ───────────────────────────────────────

        const hashedPassword =
            await bcrypt.hash(password, 12);

        // ───────────────────────────────────────
        // UPDATE USER
        // ───────────────────────────────────────

        await db.user.update({
            where: {
                id: user.id,
            },

            data: {
                password: hashedPassword,

                resetPasswordToken: null,

                resetPasswordExpires: null,
            },
        });

        // ───────────────────────────────────────
        // SUCCESS
        // ───────────────────────────────────────

        return {
            success: true,
        };
    } catch (error) {
        console.error(
            "[RESET_PASSWORD_ERROR]",
            error
        );

        return {
            success: false,
            error:
                "Something went wrong",
        };
    }
};