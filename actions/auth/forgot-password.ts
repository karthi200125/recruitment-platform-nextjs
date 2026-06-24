"use server";

import crypto from "crypto";
import * as z from "zod";
import { db } from "@/lib/db";
import { sendResetEmail } from "@/lib/auth/mail";
import { rateLimit } from "@/lib/auth/rateLimit";

// ─────────────────────────────────────────────
// SCHEMA
// ─────────────────────────────────────────────

const ForgotPasswordSchema =
    z.object({
        email:
            z.string().email(),
    });

// ─────────────────────────────────────────────
// FORGOT PASSWORD
// ─────────────────────────────────────────────

export const forgotPassword =
    async (email: string) => {
        try {
            // ─────────────────────────────────────
            // RATE LIMIT
            // ─────────────────────────────────────

            await rateLimit(
                `forgot-password:${email}`
            );

            // ─────────────────────────────────────
            // VALIDATE
            // ─────────────────────────────────────

            const parsed =
                ForgotPasswordSchema.safeParse(
                    {
                        email,
                    }
                );

            if (!parsed.success) {
                return {
                    success: true,
                };
            }

            // ─────────────────────────────────────
            // NORMALIZE
            // ─────────────────────────────────────

            const normalizedEmail =
                parsed.data.email
                    .trim()
                    .toLowerCase();

            // ─────────────────────────────────────
            // FIND USER
            // ─────────────────────────────────────

            const user =
                await db.user.findUnique({
                    where: {
                        email:
                            normalizedEmail,
                    },

                    select: {
                        id: true,
                    },
                });

            // SECURITY:
            // always return success

            if (!user) {
                return {
                    success: true,
                };
            }

            // ─────────────────────────────────────
            // GENERATE TOKEN
            // ─────────────────────────────────────

            const resetToken =
                crypto
                    .randomBytes(32)
                    .toString("hex");

            const hashedToken =
                crypto
                    .createHash(
                        "sha256"
                    )
                    .update(resetToken)
                    .digest("hex");

            // ─────────────────────────────────────
            // EXPIRY
            // ─────────────────────────────────────

            const expires =
                new Date(
                    Date.now() +
                    1000 *
                    60 *
                    15
                );

            // ─────────────────────────────────────
            // SAVE TOKEN
            // ─────────────────────────────────────

            await db.user.update({
                where: {
                    id: user.id,
                },

                data: {
                    resetPasswordToken:
                        hashedToken,

                    resetPasswordExpires:
                        expires,
                },
            });

            // ─────────────────────────────────────
            // EMAIL
            // ─────────────────────────────────────

            const resetLink =
                `${process.env.NEXT_PUBLIC_URL}/reset-password?token=${resetToken}`;

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

            // SECURITY:
            // always success

            return {
                success: true,
            };
        }
    };