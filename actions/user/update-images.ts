'use server';

import { db } from '@/lib/db';

export const updateImages = async (
    userId: number,
    userImage?: string | null,
    profileImage?: string | null,
    isOrg?: boolean
) => {
    try {        
        if (!userId) {
            throw new Error('User ID is required');
        }
        
        if (!userImage && !profileImage) {
            throw new Error('At least one image field must be provided');
        }

        const updateData: Record<string, string> = {};
        if (userImage) updateData.userImage = userImage;
        if (profileImage) updateData.profileImage = profileImage;

        const updatedUser = await db.user.update({
            where: { id: userId },
            data: updateData,
        });

        if (isOrg) {
            await db.company.updateMany({
                where: { userId },
                data: {
                    companyImage: userImage || undefined,
                    companyBackImage: profileImage || undefined,
                },
            });
        }

        return { success: 'User images updated successfully', data: updatedUser };
    } catch (error: any) {
        console.error('Error updating user images:', error);
        return { error: 'User image update failed', details: error.message };
    }
};
