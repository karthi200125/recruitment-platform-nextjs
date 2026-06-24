'use server';

import { db } from '@/lib/db';

export const deleteExperience = async (expId: number) => {
    try {
        await db.experience.delete({
            where: {
                id: expId,
            }
        });

        return { success: 'User Experience Deleted successfully' };
    } catch (error) {
        return { error: 'User Experience Delete failed' };
    }
};
