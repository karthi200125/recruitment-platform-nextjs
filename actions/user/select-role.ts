'use server';

import * as z from "zod";

import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth/authOptions";

import { db } from "@/lib/db";

// ─────────────────────────────────────────────
// ROLE SCHEMA
// ─────────────────────────────────────────────

const RoleSchema = z.enum([
    "CANDIDATE",
    "RECRUITER",
    "ORGANIZATION",
]);

// ─────────────────────────────────────────────
// RESPONSE TYPE
// ─────────────────────────────────────────────

type ActionResponse = {
    success: boolean;
    error?: string;
};

// ─────────────────────────────────────────────
// SELECT ROLE
// ─────────────────────────────────────────────

export const selectRole = async (
    role: z.infer<typeof RoleSchema>
): Promise<ActionResponse> => {
    try {
        // ───────────────────────────────────────
        // VALIDATE ROLE
        // ───────────────────────────────────────

        const validatedRole =
            RoleSchema.safeParse(role);

        if (!validatedRole.success) {
            return {
                success: false,
                error: "Invalid role",
            };
        }

        // ───────────────────────────────────────
        // SESSION
        // ───────────────────────────────────────

        const session =
            await getServerSession(
                authOptions
            );

        if (!session?.user?.id) {
            return {
                success: false,
                error: "Unauthorized",
            };
        }

        // ───────────────────────────────────────
        // CHECK USER
        // ───────────────────────────────────────

        const existingUser =
            await db.user.findUnique({
                where: {
                    id: Number(
                        session.user.id
                    ),
                },

                select: {
                    id: true,
                    role: true,
                },
            });

        if (!existingUser) {
            return {
                success: false,
                error: "User not found",
            };
        }

        // ───────────────────────────────────────
        // ALREADY HAS ROLE
        // ───────────────────────────────────────

        if (existingUser.role) {
            return {
                success: false,
                error:
                    "Role already selected",
            };
        }

        // ───────────────────────────────────────
        // UPDATE ROLE
        // ───────────────────────────────────────

        await db.user.update({
            where: {
                id: existingUser.id,
            },

            data: {
                role:
                    validatedRole.data,
            },
        });

        return {
            success: true,
        };
    } catch (error) {
        console.error(
            "[SELECT_ROLE_ERROR]",
            error
        );

        return {
            success: false,
            error:
                "Something went wrong",
        };
    }
};