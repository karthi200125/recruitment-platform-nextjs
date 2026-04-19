'use server';

import { LoginSchema, RoleSchema } from '@/lib/SchemaTypes';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';
import * as z from 'zod';

type LoginRole = z.infer<typeof RoleSchema>;

export const login = async (
    values: z.infer<typeof LoginSchema>,
    role: LoginRole
) => {
    try {
        const validatedFields = LoginSchema.safeParse(values);
        const validatedRole = RoleSchema.safeParse(role);

        if (!validatedFields.success) {
            return { error: 'Invalid fields' };
        }

        if (!validatedRole.success) {
            return { error: 'Invalid role selected' };
        }

        const { email, password } = validatedFields.data;

        const existingUser = await db.user.findUnique({
            where: { email },
        });

        if (!existingUser?.password) {
            return { error: 'Email or password incorrect' };
        }

        const isPasswordValid = await bcrypt.compare(
            password,
            existingUser.password
        );

        if (!isPasswordValid) {
            return { error: 'Email or password incorrect' };
        }

        if (existingUser.role !== validatedRole.data) {
            return { error: 'Role does not match this account' };
        }

        return {
            success: 'User login successful',
            data: {
                id: existingUser.id,
                email: existingUser.email,
                username: existingUser.username,
                role: existingUser.role,
            },
        };
    } catch (error) {
        console.error('Login error:', error);

        return {
            error: 'User login failed',
        };
    }
};