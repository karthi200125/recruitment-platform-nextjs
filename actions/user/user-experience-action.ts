'use server';

import { UserExperienceSchema } from '@/lib/SchemaTypes';
import { db } from '@/lib/db';
import * as z from 'zod';

export const userExperienceAction = async (
    values: z.infer<typeof UserExperienceSchema>,
    userId?: any,
    isEdit: boolean = false,
    expId?: number
) => {
    try {
        const validatedFields = UserExperienceSchema.safeParse(values);

        if (!validatedFields.success) {
            return { error: 'Invalid fields', issues: validatedFields.error.issues };
        }

        const data = validatedFields.data;

        let Experience;

        if (!isEdit) {
            Experience = await db.experience.create({
                data: {
                    ...data,
                    userId,
                },
            });
        } else {
            Experience = await db.experience.update({
                where: {
                    id: expId,
                },
                data: {
                    ...data,
                    userId,
                },
            });
        }

        return { success: !isEdit ? "User Experience Created Successfully" : 'User Experience Edited Successfully', data: Experience };
    } catch (error) {
        return { error: !isEdit ? "User Experience Created failed" : 'User Experience Edited failed' };
    }
};
