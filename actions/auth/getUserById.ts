'use server';

import { db } from '@/lib/db';
import { Prisma } from '@prisma/client';

interface ActionResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// ✅ Strong Prisma type (UPDATED with relations)
export type ProfileUser = Prisma.UserGetPayload<{
  include: {
    jobApplications: true;
    postedJobs: true;
    company: {
      include: {
        jobs: true;
      };
    };
    educations: true;
    experiences: true;
    projects: true;

    // ✅ ADD THESE (important)
    followers: {
      select: { id: true };
    };
    following: {
      select: { id: true };
    };
  };
}>;

export const getUserById = async (
  id: number
): Promise<ActionResponse<ProfileUser>> => {
  try {
    // ✅ Validation
    if (!id || typeof id !== 'number') {
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

        // ✅ Relations
        followers: {
          select: { id: true },
        },
        following: {
          select: { id: true },
        },
      },
    });

    // ✅ Handle not found (CRITICAL)
    if (!user) {
      return {
        success: false,
        error: 'User not found',
      };
    }

    // ✅ Normalize userAbout safely
    const formattedUser: ProfileUser = {
      ...user,
      userAbout:
        typeof user.userAbout === 'string'
          ? user.userAbout
          : user.userAbout
            ? JSON.stringify(user.userAbout)
            : null,
    };

    return {
      success: true,
      data: formattedUser,
    };
  } catch (error) {
    console.error('[getUserById]', error);

    return {
      success: false,
      error: 'Something went wrong while fetching user',
    };
  }
};