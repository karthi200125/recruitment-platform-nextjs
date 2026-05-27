'use server';

import bcrypt from "bcryptjs";

import * as z from "zod";

import { db } from "@/lib/db";

import { RegisterSchema } from "@/lib/SchemaTypes";

// ─────────────────────────────────────────────
// REGISTER
// ─────────────────────────────────────────────

export const register = async (
    values: z.infer<typeof RegisterSchema>
) => {
    try {
        // ───────────────────────────────────────
        // VALIDATE INPUT
        // ───────────────────────────────────────

        const validatedFields =
            RegisterSchema.safeParse(values);

        if (!validatedFields.success) {
            return {
                success: false,
                error: "Invalid fields",
            };
        }

        // ───────────────────────────────────────
        // NORMALIZE DATA
        // ───────────────────────────────────────

        const email =
            validatedFields.data.email
                .trim()
                .toLowerCase();

        const username =
            validatedFields.data.username
                .trim();

        const password =
            validatedFields.data.password;

        // ───────────────────────────────────────
        // CHECK EMAIL
        // ───────────────────────────────────────

        const existingEmail =
            await db.user.findUnique({
                where: {
                    email,
                },

                select: {
                    id: true,
                },
            });

        if (existingEmail) {
            return {
                success: false,
                error:
                    "Email already exists",
            };
        }

        // ───────────────────────────────────────
        // CHECK USERNAME
        // ───────────────────────────────────────

        const existingUsername =
            await db.user.findUnique({
                where: {
                    username,
                },

                select: {
                    id: true,
                },
            });

        if (existingUsername) {
            return {
                success: false,
                error:
                    "Username already exists",
            };
        }

        // ───────────────────────────────────────
        // HASH PASSWORD
        // ───────────────────────────────────────

        const hashedPassword =
            await bcrypt.hash(password, 12);

        // ───────────────────────────────────────
        // CREATE USER
        // ───────────────────────────────────────

        const user =
            await db.user.create({
                data: {
                    username,
                    email,
                    password: hashedPassword,
                },

                select: {
                    id: true,
                    email: true,
                },
            });

        return {
            success: true,

            data: {
                id: String(user.id),
                email: user.email,
            },
        };
    } catch (error) {
        console.error(
            "REGISTER_ERROR",
            error
        );

        return {
            success: false,
            error:
                "Something went wrong",
        };
    }
};