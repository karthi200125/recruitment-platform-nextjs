"use server";

import { cache } from "react";

import { db } from "@/lib/db";

import {
    CandidateRecruiterProfile,
    OrganizationProfile,
    ProfileUser,
} from "@/types/userProfile";

interface ActionResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

/**
 * Candidate / Recruiter profile
 *
 * Fetch only data required by the core profile.
 */
const getCandidateRecruiterProfile = cache(
    async (id: number) => {
        return db.user.findUnique({
            where: {
                id,
            },

            include: {
                educations: true,

                experiences: true,

                projects: true,

                _count: {
                    select: {
                        followers: true,
                        following: true,
                    },
                },
            },
        });
    }
);

/**
 * Organization profile
 *
 * Only fetch core user + basic company data here.
 *
 * Company jobs and employees are handled separately
 * by the company profile section.
 */
const getOrganizationProfile = cache(
    async (id: number) => {
        return db.user.findUnique({
            where: {
                id,
            },

            include: {
                company: true,

                _count: {
                    select: {
                        followers: true,
                        following: true,
                    },
                },
            },
        });
    }
);

/**
 * Get user profile by ID.
 */
export const getUserProfileUserById = cache(
    async (
        id: number
    ): Promise<ActionResponse<ProfileUser>> => {
        try {
            /**
             * Validate user ID.
             */
            if (!Number.isInteger(id) || id <= 0) {
                return {
                    success: false,
                    error: "Invalid user ID",
                };
            }

            /**
             * Get user role.
             */
            const roleCheck = await db.user.findUnique({
                where: {
                    id,
                },

                select: {
                    role: true,
                },
            });

            if (!roleCheck) {
                return {
                    success: false,
                    error: "User not found",
                };
            }

            /**
             * ORGANIZATION
             */
            if (roleCheck.role === "ORGANIZATION") {
                const user =
                    await getOrganizationProfile(id);

                if (!user) {
                    return {
                        success: false,
                        error: "User not found",
                    };
                }

                /**
                 * Normalize userAbout.
                 */
                const userAbout =
                    typeof user.userAbout === "string"
                        ? user.userAbout
                        : user.userAbout
                            ? JSON.stringify(
                                user.userAbout
                            )
                            : null;

                const formattedUser: OrganizationProfile = {
                    ...user,
                    userAbout,
                };

                return {
                    success: true,
                    data: formattedUser,
                };
            }

            /**
             * CANDIDATE / RECRUITER
             */
            const user =
                await getCandidateRecruiterProfile(id);

            if (!user) {
                return {
                    success: false,
                    error: "User not found",
                };
            }

            /**
             * Normalize userAbout.
             */
            const userAbout =
                typeof user.userAbout === "string"
                    ? user.userAbout
                    : user.userAbout
                        ? JSON.stringify(
                            user.userAbout
                        )
                        : null;

            const formattedUser: CandidateRecruiterProfile = {
                ...user,
                userAbout,
            };

            return {
                success: true,
                data: formattedUser,
            };
        } catch (error) {
            console.error(
                "[getUserProfileUserById]",
                error
            );

            return {
                success: false,
                error: "Something went wrong while fetching user",
            };
        }
    }
);