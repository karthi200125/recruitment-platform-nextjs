'use server';

import { db } from '@/lib/db';

export const userSkillAction = async (skills: string[], userId: number) => {
    try {
        const userSkills = await db.user.update({
            where: {
                id: userId,
            },
            data: {
                skills,
            },
        });

        return { success: 'User skills updated successfully', data: userSkills };
    } catch (error) {
        return { error: 'User skills update failed' };
    }
};
