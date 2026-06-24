'use server';

import { db } from '@/lib/db';

export const deleteProject = async (proId: number) => {
    try {
        await db.project.delete({
            where: {
                id: proId,
            }
        });

        return { success: 'User Project Deleted successfully' };
    } catch (error) {
        return { error: 'User Project Delete failed' };
    }
};
