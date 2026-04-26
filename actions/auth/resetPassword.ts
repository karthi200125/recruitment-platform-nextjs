"use server";

import crypto from "crypto";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { z } from "zod";
import { rateLimit } from "@/lib/rateLimit";

const schema = z.object({
    token: z.string(),
    password: z.string().min(6),
});

export const resetPassword = async (token: string, password: string) => {
    try {
        // ✅ RATE LIMIT (per token)
        await rateLimit(`reset-password:${token}`);
    } catch {
        return { success: false, error: "Too many attempts. Try later." };
    }

    const parsed = schema.safeParse({ token, password });

    if (!parsed.success) {
        return { success: false, error: "Invalid input" };
    }

    const hashedToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

    const user = await db.user.findFirst({
        where: {
            resetPasswordToken: hashedToken,
            resetPasswordExpires: {
                gt: new Date(),
            },
        },
    });

    if (!user) {
        return { success: false, error: "Token expired or invalid" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.user.update({
        where: { id: user.id },
        data: {
            password: hashedPassword,
            resetPasswordToken: null,
            resetPasswordExpires: null,
        },
    });

    return { success: true };
};