"use server";

import crypto from "crypto";
import * as z from "zod";
import { db } from "@/lib/db";
import { sendResetEmail } from "@/lib/authentication/mail";
import { rateLimit } from "@/lib/authentication/rateLimit";

const ForgotPasswordSchema = z.object({ email: z.string().email() });

export const forgotPassword =
    async (email: string) => {
        try {
            await rateLimit(`forgot-password:${email}`);
            const parsed = ForgotPasswordSchema.safeParse({ email });
            if (!parsed.success) { return { success: true, } }
            const normalizedEmail = parsed.data.email.trim().toLowerCase();

            const user =
                await db.user.findUnique({
                    where: { email: normalizedEmail, },
                    select: { id: true, },
                });

            if (!user) { return { success: true, }; }

            const resetToken = crypto.randomBytes(32).toString("hex");
            const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
            const expires = new Date(Date.now() + 1000 * 60 * 15);
            await db.user.update({
                where: { id: user.id, },

                data: {
                    resetPasswordToken: hashedToken,
                    resetPasswordExpires: expires,
                },
            });

            const resetLink = `${process.env.NEXT_PUBLIC_URL}/reset-password?token=${resetToken}`;
            await sendResetEmail(normalizedEmail, resetLink);
            return { success: true, };
        } catch (error) {
            console.error("[FORGOT_PASSWORD_ERROR]", error);
            return { success: true, };
        }
    };