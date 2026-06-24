'use server';

import { UserEducationSchema } from '@/lib/SchemaTypes';
import { db } from '@/lib/db';
import * as z from 'zod';

export const userEducationAction = async (
    values: z.infer<typeof UserEducationSchema>,
    userId?: any,
    isEdit: boolean = false,
    eduId?: number
) => {
    try {
        const validatedFields = UserEducationSchema.safeParse(values);

        if (!validatedFields.success) {
            return { error: 'Invalid fields', issues: validatedFields.error.issues };
        }

        const data = validatedFields.data;

        let education;

        if (!isEdit) {
            education = await db.education.create({
                data: {
                    ...data,
                    userId,
                },
            });
        } else {
            education = await db.education.update({
                where: {
                    id: eduId,
                },
                data: {
                    ...data,
                    userId,
                },
            });
        }

        return { success: !isEdit ? "User Education Created Successfully" : 'User Education Edited Successfully', data: education };
    } catch (error) {
        return { error: !isEdit ? "User Education Created failed" : 'User Education Edited failed' };
    }
};
