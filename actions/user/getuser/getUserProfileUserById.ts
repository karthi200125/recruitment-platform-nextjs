'use server';

import { db } from '@/lib/db';
import { ProfileUser } from '@/types/userProfile';

interface ActionResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

export const getUserProfileUserById = async (
    id: number
): Promise<ActionResponse<ProfileUser>> => {
    try {
        // ✅ Better validation
        if (!Number.isInteger(id) || id <= 0) {
            return {
                success: false,
                error: 'Invalid user ID',
            };
        }

        const user = await db.user.findUnique({
            where: { id },
            include: {
                jobApplications: true,
                postedJobs: true,
                company: {
                    include: {
                        jobs: true,
                    },
                },
                educations: true,
                experiences: true,
                projects: true,
                followers: {
                    select: { id: true },
                },
                following: {
                    select: { id: true },
                },
            },
        });

        if (!user) {
            return {
                success: false,
                error: 'User not found',
            };
        }

        // ⚠️ Fix JSON → string mismatch
        const formattedUser: ProfileUser = {
            ...user,
            userAbout:
                typeof user.userAbout === 'string'
                    ? user.userAbout
                    : user.userAbout
                        ? JSON.stringify(user.userAbout)
                        : null,
        } as ProfileUser;

        return {
            success: true,
            data: formattedUser,
        };
    } catch (error) {
        console.error('[getUserProfileUserById]', error);

        return {
            success: false,
            error: 'Something went wrong while fetching user',
        };
    }
};