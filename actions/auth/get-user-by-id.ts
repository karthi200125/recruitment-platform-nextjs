'use server';

import { db } from '@/lib/db';
import { Prisma } from '@prisma/client';

interface ActionResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

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

    followers: {
      select: {
        followerId: true;
      };
    };

    following: {
      select: {
        followingId: true;
      };
    };
  };
}>;

export const getUserById = async (
  id: number
): Promise<ActionResponse<ProfileUser>> => {
  try {
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

        followers: {
          select: {
            followerId: true,
          },
        },

        following: {
          select: {
            followingId: true,
          },
        },
      },
    });

    if (!user) {
      return {
        success: false,
        error: 'User not found',
      };
    }

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