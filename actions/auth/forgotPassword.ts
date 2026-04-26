"use server";

import crypto from "crypto";
import { db } from "@/lib/db";
import { sendResetEmail } from "@/lib/mail";
import { z } from "zod";
import { rateLimit } from "@/lib/rateLimit";

const schema = z.object({
    email: z.string().email(),
});

export const forgotPassword = async (email: string) => {
    try {
        // ✅ RATE LIMIT (per email)
        await rateLimit(`forgot-password:${email}`);
    } catch {
        // Always return success (security)
        return { success: true };
    }

    const parsed = schema.safeParse({ email });

    if (!parsed.success) {
        return { success: true };
    }

    const user = await db.user.findUnique({
        where: { email },
    });

    if (!user) return { success: true };

    const token = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

    const expiry = new Date(Date.now() + 1000 * 60 * 15);

    await db.user.update({
        where: { email },
        data: {
            resetPasswordToken: hashedToken,
            resetPasswordExpires: expiry,
        },
    });

    const resetLink = `${process.env.NEXT_PUBLIC_URL}/reset-password?token=${token}`;

    await sendResetEmail(email, resetLink);

    return { success: true };
};