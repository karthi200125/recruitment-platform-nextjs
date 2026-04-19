'use server';

import { db } from '@/lib/db';
import { Prisma } from '@prisma/client';

interface ActionResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// ✅ Strong Prisma type
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
      },
    });

    // ✅ Not found handling
    if (!user) {
      return {
        success: false,
        error: 'User not found',
      };
    }

    return {
      success: true,
      data: {
        ...user,
        userAbout:
          typeof user.userAbout === "string"
            ? user.userAbout
            : JSON.stringify(user.userAbout),
      },
    };
  } catch (error) {
    console.error('[getUserById]', error);

    return {
      success: false,
      error: 'Something went wrong while fetching user',
    };
  }
};