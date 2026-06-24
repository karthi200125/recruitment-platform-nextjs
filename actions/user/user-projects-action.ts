'use server';

import { db } from '@/lib/db';
import { UserProjectSchema } from '@/lib/SchemaTypes';
import * as z from 'zod';

export const userProjectAction = async (
    values: z.infer<typeof UserProjectSchema>,
    userId?: any,
    isEdit: boolean = false,
    proId?: any,
    proImage?: any
) => {
    try {
        const validatedFields = UserProjectSchema.safeParse(values);

        if (!validatedFields.success) {
            return { error: 'Invalid fields' };
        }

        const data = validatedFields.data;

        let project;

        if (!isEdit) {
            project = await db.project.create({
                data: {
                    ...data,
                    userId,
                    proImage
                },
            });
        } else {
            project = await db.project.update({
                where: {
                    id: proId,
                },
                data: {
                    ...data,
                    userId,
                    proImage
                },
            });
        }

        return { success: isEdit ? `${project?.proName} Has been edited successfully` : `U${project?.proName} Has been created successfully`, data: project };
    } catch (error) {
        return { error: 'User project processing failed' };
    }
};
