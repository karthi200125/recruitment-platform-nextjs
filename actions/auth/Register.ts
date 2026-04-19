'use server';

import { RegisterSchema, RoleSchema } from '@/lib/SchemaTypes';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';
import * as z from 'zod';

export const register = async (
    values: z.infer<typeof RegisterSchema>,
    role: z.infer<typeof RoleSchema>
) => {
    try {
        const validatedFields = RegisterSchema.safeParse(values);
        const validatedRole = RoleSchema.safeParse(role);

        if (!validatedFields.success) {
            return { error: "Invalid fields" };
        }

        if (!validatedRole.success) {
            return { error: "Invalid role selected" };
        }

        const { username, email, password } = validatedFields.data;

        const existingUser = await db.user.findFirst({
            where: {
                OR: [{ email }, { username }],
            },
        });

        if (existingUser) {
            return { error: "User already exists" };
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = await db.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
                role: validatedRole.data,
            },
        });

        return {
            success: "User registration successful",
            data: {
                id: newUser.id,
                email: newUser.email,
                username: newUser.username,
                role: newUser.role,
            },
        };
    } catch (error) {
        console.error("Registration error:", error);
        return { error: "Registration failed" };
    }
};