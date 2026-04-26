'use server';

import * as z from "zod";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";

import { db } from "@/lib/db";
import { authOptions } from "@/lib/authOptions";
import { ChangeEmailSchema, ChangePasswordSchema, DeleteAccountSchema } from "@/lib/SchemaTypes";


// CHANGE PASSWORD
export const changePassword = async (
    values: z.infer<typeof ChangePasswordSchema>
) => {
    const validated = ChangePasswordSchema.safeParse(values);
    if (!validated.success) return { error: "Invalid fields" };

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return { error: "Unauthorized" };

    const user = await db.user.findUnique({
        where: { id: session.user.id },
    });

    if (!user) return { error: "User not found" };

    const isValid = await bcrypt.compare(
        validated.data.oldPassword,
        user.password
    );

    if (!isValid) return { error: "Incorrect old password" };

    const hashed = await bcrypt.hash(validated.data.newPassword, 10);

    await db.user.update({
        where: { id: user.id },
        data: { password: hashed },
    });

    return { success: "Password updated" };
};

// CHANGE EMAIL
export const changeEmail = async (
    values: z.infer<typeof ChangeEmailSchema>
) => {
    const validated = ChangeEmailSchema.safeParse(values);
    if (!validated.success) return { error: "Invalid email" };

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return { error: "Unauthorized" };

    await db.user.update({
        where: { id: session.user.id },
        data: { email: validated.data.email },
    });

    return { success: "Email updated" };
};

// DELETE ACCOUNT
export const deleteAccount = async (
    values: z.infer<typeof DeleteAccountSchema>
) => {
    const validated = DeleteAccountSchema.safeParse(values);
    if (!validated.success) return { error: "Invalid input" };

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return { error: "Unauthorized" };

    const user = await db.user.findUnique({
        where: { id: session.user.id },
    });

    if (!user) return { error: "User not found" };

    const isValid = await bcrypt.compare(
        validated.data.password,
        user.password
    );

    if (!isValid) return { error: "Incorrect password" };

    await db.user.delete({
        where: { id: user.id },
    });

    return { success: "Account deleted" };
};