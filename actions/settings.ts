// actions/settings.ts

'use server';

import * as z from "zod";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";

import { db } from "@/lib/db";
import { authOptions } from "@/lib/authOptions";


// =========================
// SCHEMAS
// =========================

export const ChangePasswordSchema = z.object({
    oldPassword: z.string().min(1, "Old password is required"),
    newPassword: z
        .string()
        .min(8, "Password must be at least 8 characters"),
});

export const ChangeEmailSchema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().optional(),
});

export const DeleteAccountSchema = z.object({
    password: z.string().optional(),
    confirmText: z.string().refine(
        (val) => val === "DELETE",
        {
            message: 'Type "DELETE" to confirm',
        }
    ),
});


// =========================
// CHANGE PASSWORD
// =========================

export const changePassword = async (
    values: z.infer<typeof ChangePasswordSchema>
) => {
    const validated = ChangePasswordSchema.safeParse(values);

    if (!validated.success) {
        return { error: "Invalid fields" };
    }

    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return { error: "Unauthorized" };
    }

    const user = await db.user.findUnique({
        where: {
            id: session.user.id,
        },
    });

    if (!user) {
        return { error: "User not found" };
    }

    // Only credentials users can change password
    if (user.authProvider !== "credentials") {
        return {
            error: "Google accounts cannot change password here",
        };
    }

    if (!user.password) {
        return { error: "Password not found" };
    }

    const isValid = await bcrypt.compare(
        validated.data.oldPassword,
        user.password
    );

    if (!isValid) {
        return { error: "Incorrect old password" };
    }

    const hashedPassword = await bcrypt.hash(
        validated.data.newPassword,
        10
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
        success: "Password updated successfully",
    };
};


// =========================
// CHANGE EMAIL
// =========================

export const changeEmail = async (
    values: z.infer<typeof ChangeEmailSchema>
) => {
    const validated = ChangeEmailSchema.safeParse(values);

    if (!validated.success) {
        return { error: "Invalid email" };
    }

    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return { error: "Unauthorized" };
    }

    const user = await db.user.findUnique({
        where: {
            id: session.user.id,
        },
    });

    if (!user) {
        return { error: "User not found" };
    }

    const email = validated.data.email.toLowerCase();

    // Check email already exists
    const existingUser = await db.user.findUnique({
        where: {
            email,
        },
    });

    if (existingUser && existingUser.id !== user.id) {
        return {
            error: "Email already in use",
        };
    }

    // Credentials users must verify password
    if (user.authProvider === "credentials") {

        if (!validated.data.password) {
            return {
                error: "Password required",
            };
        }

        if (!user.password) {
            return {
                error: "Password not found",
            };
        }

        const isValid = await bcrypt.compare(
            validated.data.password,
            user.password
        );

        if (!isValid) {
            return {
                error: "Incorrect password",
            };
        }
    }

    await db.user.update({
        where: {
            id: user.id,
        },
        data: {
            email,
        },
    });

    return {
        success: "Email updated successfully",
    };
};


// =========================
// DELETE ACCOUNT
// =========================

export const deleteAccount = async (
    values: z.infer<typeof DeleteAccountSchema>
) => {
    const validated = DeleteAccountSchema.safeParse(values);

    if (!validated.success) {
        return { error: "Invalid input" };
    }

    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return { error: "Unauthorized" };
    }

    const user = await db.user.findUnique({
        where: {
            id: session.user.id,
        },
    });

    if (!user) {
        return { error: "User not found" };
    }

    // Credentials users require password
    if (user.authProvider === "credentials") {

        if (!validated.data.password) {
            return {
                error: "Password required",
            };
        }

        if (!user.password) {
            return {
                error: "Password not found",
            };
        }

        const isValid = await bcrypt.compare(
            validated.data.password,
            user.password
        );

        if (!isValid) {
            return {
                error: "Incorrect password",
            };
        }
    }

    // DELETE text confirmation
    if (validated.data.confirmText !== "DELETE") {
        return {
            error: 'Please type "DELETE"',
        };
    }

    await db.user.delete({
        where: {
            id: user.id,
        },
    });

    return {
        success: "Account deleted successfully",
    };
};