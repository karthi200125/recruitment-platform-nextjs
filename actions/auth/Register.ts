'use server';

import { RegisterSchema } from '@/lib/SchemaTypes';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';
import * as z from 'zod';

export const register = async (
    values: z.infer<typeof RegisterSchema>
) => {
    try {
        const validatedFields = RegisterSchema.safeParse(values);

        if (!validatedFields.success) {
            return { error: "Invalid fields" };
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
            },
        });

        return {
            success: "User created",
            data: {
                id: newUser.id,
                email: newUser.email,
            },
        };
    } catch (error) {
        console.error("Registration error:", error);
        return { error: "Registration failed" };
    }
};