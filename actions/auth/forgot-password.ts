"use server";

import crypto from "crypto";
import * as z from "zod";

import { db } from "@/lib/db";
import { sendResetEmail } from "@/lib/authentication/mail";
import { rateLimit } from "@/lib/authentication/rateLimit";

const ForgotPasswordSchema = z.object({
    email: z
        .string()
        .trim()
        .toLowerCase()
        .email("Invalid email address"),
});

interface ForgotPasswordResponse {
    success: boolean;
    message?: string;
}

export const forgotPassword = async (
    email: string
): Promise<ForgotPasswordResponse> => {
    try {
        const parsed = ForgotPasswordSchema.safeParse({
            email,
        });

        if (!parsed.success) {
            return {
                success: true,
            };
        }

        const normalizedEmail = parsed.data.email;

        await rateLimit(
            `forgot-password:${normalizedEmail}`
        );

        const user = await db.user.findUnique({
            where: {
                email: normalizedEmail,
            },
            select: {
                id: true,
            },
        });

        if (!user) {
            return {
                success: true,
            };
        }

        const resetToken = crypto
            .randomBytes(32)
            .toString("hex");

        const hashedToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        const expires = new Date(
            Date.now() + 15 * 60 * 1000
        );

        await db.user.update({
            where: {
                id: user.id,
            },
            data: {
                resetPasswordToken: hashedToken,
                resetPasswordExpires: expires,
            },
        });

        const baseUrl =
            process.env.NEXT_PUBLIC_URL?.replace(
                /\/$/,
                ""
            );

        if (!baseUrl) {
            console.error(
                "[FORGOT_PASSWORD_ERROR] NEXT_PUBLIC_URL is not configured."
            );

            return {
                success: false,
                message:
                    "Unable to send the reset email. Please try again later.",
            };
        }

        const resetLink =
            `${baseUrl}/reset-password?token=${encodeURIComponent(
                resetToken
            )}`;

        await sendResetEmail(
            normalizedEmail,
            resetLink
        );

        return {
            success: true,
        };
    } catch (error) {
        console.error(
            "[FORGOT_PASSWORD_ERROR]",
            error
        );

        return {
            success: false,
            message:
                "Unable to send the reset email. Please try again later.",
        };
    }
};