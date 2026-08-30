"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";

import { db } from "@/lib/db";
import { authOptions } from "@/lib/authentication/authOptions";

import {
    ChangePasswordSchema,
    ChangeEmailSchema,
    DeleteAccountSchema,
} from "@/lib/SchemaTypes";


// ============================================================
// CHANGE PASSWORD
// ============================================================

export const changePassword = async (
    values: z.infer<typeof ChangePasswordSchema>
) => {
    try {
        const validated =
            ChangePasswordSchema.safeParse(values);

        if (!validated.success) {
            return {
                error: "Invalid fields",
            };
        }

        const session =
            await getServerSession(authOptions);

        if (!session?.user?.id) {
            return {
                error: "Unauthorized",
            };
        }

        const userId = Number(session.user.id);

        if (!Number.isInteger(userId) || userId <= 0) {
            return {
                error: "Invalid user",
            };
        }

        const user =
            await db.user.findUnique({
                where: {
                    id: userId,
                },
                select: {
                    id: true,
                    password: true,
                    authProvider: true,
                },
            });

        if (!user) {
            return {
                error: "User not found",
            };
        }

        if (
            user.authProvider !==
            "credentials"
        ) {
            return {
                error:
                    "Google accounts cannot change password here",
            };
        }

        if (!user.password) {
            return {
                error: "Password not found",
            };
        }

        const isCurrentPasswordValid =
            await bcrypt.compare(
                validated.data.currentPassword,
                user.password
            );

        if (!isCurrentPasswordValid) {
            return {
                error: "Incorrect current password",
            };
        }

        const hashedPassword =
            await bcrypt.hash(
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
            success:
                "Password updated successfully",
        };
    } catch (error) {
        console.error(
            "[CHANGE_PASSWORD_ERROR]",
            error
        );

        return {
            error:
                "Something went wrong while changing your password",
        };
    }
};


// ============================================================
// CHANGE EMAIL
// ============================================================

export const changeEmail = async (
    values: z.infer<typeof ChangeEmailSchema>
) => {
    try {
        const validated =
            ChangeEmailSchema.safeParse(values);

        if (!validated.success) {
            return {
                error: "Invalid email",
            };
        }

        const session =
            await getServerSession(authOptions);

        if (!session?.user?.id) {
            return {
                error: "Unauthorized",
            };
        }

        const userId = Number(session.user.id);

        if (!Number.isInteger(userId) || userId <= 0) {
            return {
                error: "Invalid user",
            };
        }

        const user =
            await db.user.findUnique({
                where: {
                    id: userId,
                },
                select: {
                    id: true,
                    email: true,
                    password: true,
                    authProvider: true,
                },
            });

        if (!user) {
            return {
                error: "User not found",
            };
        }

        const email =
            validated.data.email
                .trim()
                .toLowerCase();

        if (
            email ===
            user.email.toLowerCase()
        ) {
            return {
                error:
                    "This is already your current email",
            };
        }

        const existingUser =
            await db.user.findUnique({
                where: {
                    email,
                },
                select: {
                    id: true,
                },
            });

        if (
            existingUser &&
            existingUser.id !== user.id
        ) {
            return {
                error: "Email already in use",
            };
        }

        if (
            user.authProvider ===
            "credentials"
        ) {
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

            const isValid =
                await bcrypt.compare(
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
            success:
                "Email updated successfully",
        };
    } catch (error) {
        console.error(
            "[CHANGE_EMAIL_ERROR]",
            error
        );

        return {
            error:
                "Something went wrong while changing your email",
        };
    }
};


// ============================================================
// DELETE ACCOUNT
// ============================================================

export const deleteAccount = async (
    values: z.infer<typeof DeleteAccountSchema>
) => {
    try {
        const validated =
            DeleteAccountSchema.safeParse(values);

        if (!validated.success) {
            return {
                error: "Invalid input",
            };
        }

        if (
            validated.data.confirmText !==
            "DELETE"
        ) {
            return {
                error: 'Please type "DELETE"',
            };
        }

        const session =
            await getServerSession(authOptions);

        if (!session?.user?.id) {
            return {
                error: "Unauthorized",
            };
        }

        const userId = Number(session.user.id);

        if (!Number.isInteger(userId) || userId <= 0) {
            return {
                error: "Invalid user",
            };
        }

        const user =
            await db.user.findUnique({
                where: {
                    id: userId,
                },
                select: {
                    id: true,
                    password: true,
                    authProvider: true,
                },
            });

        if (!user) {
            return {
                error: "User not found",
            };
        }

        if (
            user.authProvider ===
            "credentials"
        ) {
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

            const isValid =
                await bcrypt.compare(
                    validated.data.password,
                    user.password
                );

            if (!isValid) {
                return {
                    error: "Incorrect password",
                };
            }
        }

        await db.user.delete({
            where: {
                id: user.id,
            },
        });

        return {
            success:
                "Account deleted successfully",
        };
    } catch (error) {
        console.error(
            "[DELETE_ACCOUNT_ERROR]",
            error
        );

        return {
            error:
                "Failed to delete account. Please try again.",
        };
    }
};