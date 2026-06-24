'use server';

import { db } from '@/lib/db';

export const deleteEducation = async (eduId: number) => {
    try {
        await db.education.delete({
            where: {
                id: eduId,
            }
        });

        return { success: 'User Education Deleted successfully' };
    } catch (error) {
        return { error: 'User Education Delete failed' };
    }
};
